#!/usr/bin/env python3
"""Deterministic, dependency-free NES-like score renderer.

The editable score format is JSON.  It describes fixed-length patterns for two
pulse channels, one triangle channel, and one sparse noise channel.  Rendering
uses only Python's standard library and always produces mono 44.1 kHz PCM16 WAV.
"""

from __future__ import annotations

import argparse
from array import array
import hashlib
import json
import math
from pathlib import Path
import random
import re
import sys
import wave


RENDERER_VERSION = "moonwell-nes-renderer/1.0"
NOTE_RE = re.compile(r"^([A-Ga-g])([#b]?)(-?\d+)$")
NOTE_BASE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def note_to_midi(note: str) -> int:
    match = NOTE_RE.match(note)
    if not match:
        raise ValueError(f"invalid note: {note!r}")
    name, accidental, octave_text = match.groups()
    semitone = NOTE_BASE[name.upper()]
    semitone += 1 if accidental == "#" else -1 if accidental == "b" else 0
    return (int(octave_text) + 1) * 12 + semitone


def note_frequency(note: str, transpose: int = 0) -> float:
    midi = note_to_midi(note) + transpose
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def load_score(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        score = json.load(handle)
    required = {"metadata", "tempo_bpm", "beats_per_bar", "bars", "channels"}
    missing = sorted(required - score.keys())
    if missing:
        raise ValueError(f"{path}: missing keys: {', '.join(missing)}")
    if set(score["channels"]) != {"pulse1", "pulse2", "triangle", "noise"}:
        raise ValueError(f"{path}: channels must be pulse1, pulse2, triangle, noise")
    return score


def expanded_events(score: dict, channel_name: str) -> tuple[list[dict], float]:
    channel = score["channels"][channel_name]
    patterns = channel["patterns"]
    cursor = 0.0
    output: list[dict] = []
    for arrangement_item in channel["arrangement"]:
        if isinstance(arrangement_item, str):
            name, repeat, transpose = arrangement_item, 1, 0
        else:
            name = arrangement_item["pattern"]
            repeat = int(arrangement_item.get("repeat", 1))
            transpose = int(arrangement_item.get("transpose", 0))
        if name not in patterns:
            raise ValueError(f"{channel_name}: unknown pattern {name!r}")
        pattern = patterns[name]
        length = float(pattern["length"])
        for _ in range(repeat):
            for source_event in pattern.get("events", []):
                event = dict(source_event)
                event["start_beat"] = cursor + float(event.get("at", 0.0))
                event["transpose"] = transpose + int(event.get("transpose", 0))
                duration = float(event["duration"])
                if event["start_beat"] < cursor or event["start_beat"] + duration > cursor + length + 1e-7:
                    raise ValueError(f"{channel_name}/{name}: event exceeds pattern boundary")
                output.append(event)
            cursor += length
    expected = float(score["bars"]) * float(score["beats_per_bar"])
    if abs(cursor - expected) > 1e-6:
        raise ValueError(f"{channel_name}: arrangement is {cursor} beats, expected {expected}")
    return output, cursor


def envelope(index: int, audible_samples: int, attack_samples: int, release_samples: int) -> float:
    if index < 0 or index >= audible_samples:
        return 0.0
    attack = min(1.0, (index + 1) / max(1, attack_samples))
    release = min(1.0, (audible_samples - index) / max(1, release_samples))
    return min(attack, release)


def add_pulse(mix: array, event: dict, seconds_per_beat: float, sample_rate: int, level: float, default_duty: float) -> None:
    start = int(round(event["start_beat"] * seconds_per_beat * sample_rate))
    duration = max(1, int(round(float(event["duration"]) * seconds_per_beat * sample_rate)))
    gate = float(event.get("gate", 0.88))
    audible = max(1, min(duration, int(round(duration * gate))))
    velocity = float(event.get("velocity", 1.0)) * level
    duty = float(event.get("duty", default_duty))
    if not 0.04 <= duty <= 0.96:
        raise ValueError(f"pulse duty outside supported range: {duty}")
    frequency = note_frequency(event["note"], event.get("transpose", 0))
    vibrato_cents = float(event.get("vibrato_cents", 0.0))
    vibrato_hz = float(event.get("vibrato_hz", 5.0))
    phase = (start * frequency / sample_rate + float(event.get("phase", 0.0))) % 1.0
    attack_samples = int(sample_rate * float(event.get("attack_ms", 3.5)) / 1000.0)
    release_samples = int(sample_rate * float(event.get("release_ms", 12.0)) / 1000.0)
    mean = 2.0 * duty - 1.0
    scale = max(abs(1.0 - mean), abs(-1.0 - mean))
    stop = min(len(mix), start + audible)
    for sample_index in range(start, stop):
        local = sample_index - start
        if vibrato_cents:
            cents = vibrato_cents * math.sin(math.tau * vibrato_hz * local / sample_rate)
            increment = frequency * (2.0 ** (cents / 1200.0)) / sample_rate
        else:
            increment = frequency / sample_rate
        raw = 1.0 if phase < duty else -1.0
        raw = (raw - mean) / scale
        env = envelope(local, audible, attack_samples, release_samples)
        mix[sample_index] += raw * env * velocity
        phase = (phase + increment) % 1.0


def add_triangle(mix: array, event: dict, seconds_per_beat: float, sample_rate: int, level: float) -> None:
    start = int(round(event["start_beat"] * seconds_per_beat * sample_rate))
    duration = max(1, int(round(float(event["duration"]) * seconds_per_beat * sample_rate)))
    gate = float(event.get("gate", 0.94))
    audible = max(1, min(duration, int(round(duration * gate))))
    velocity = float(event.get("velocity", 1.0)) * level
    frequency = note_frequency(event["note"], event.get("transpose", 0))
    phase = (start * frequency / sample_rate + float(event.get("phase", 0.25))) % 1.0
    attack_samples = int(sample_rate * float(event.get("attack_ms", 5.0)) / 1000.0)
    release_samples = int(sample_rate * float(event.get("release_ms", 18.0)) / 1000.0)
    stop = min(len(mix), start + audible)
    for sample_index in range(start, stop):
        local = sample_index - start
        raw = 1.0 - 4.0 * abs(phase - 0.5)
        raw = round(raw * 15.0) / 15.0  # NES-like stepped triangle color.
        env = envelope(local, audible, attack_samples, release_samples)
        mix[sample_index] += raw * env * velocity
        phase = (phase + frequency / sample_rate) % 1.0


NOISE_CLOCKS = {
    "tick": 9200.0,
    "leaf": 4100.0,
    "snare": 7100.0,
    "kick": 900.0,
    "shimmer": 12200.0,
}


def add_noise(mix: array, event: dict, seconds_per_beat: float, sample_rate: int, level: float, seed: int) -> None:
    start = int(round(event["start_beat"] * seconds_per_beat * sample_rate))
    duration = max(1, int(round(float(event["duration"]) * seconds_per_beat * sample_rate)))
    velocity = float(event.get("velocity", 1.0)) * level
    kind = event.get("kind", "leaf")
    clock = float(event.get("clock_hz", NOISE_CLOCKS[kind]))
    rng = random.Random(seed)
    lfsr = rng.randrange(1, 0x7FFF)
    phase = 0.0
    attack_samples = max(1, int(sample_rate * float(event.get("attack_ms", 0.8)) / 1000.0))
    decay = float(event.get("decay", 5.5 if kind != "leaf" else 3.4))
    current = -1.0
    stop = min(len(mix), start + duration)
    for sample_index in range(start, stop):
        local = sample_index - start
        phase += clock / sample_rate
        while phase >= 1.0:
            feedback = (lfsr ^ (lfsr >> 1)) & 1
            lfsr = (lfsr >> 1) | (feedback << 14)
            current = 1.0 if lfsr & 1 else -1.0
            phase -= 1.0
        attack = min(1.0, (local + 1) / attack_samples)
        t = local / max(1, duration - 1)
        env = attack * math.exp(-decay * t)
        mix[sample_index] += current * env * velocity


def render(score: dict) -> tuple[array, dict]:
    sample_rate = int(score.get("sample_rate", 44100))
    if sample_rate != 44100:
        raise ValueError("this project intentionally fixes sample_rate at 44100")
    seconds_per_beat = 60.0 / float(score["tempo_bpm"])
    total_beats = float(score["bars"]) * float(score["beats_per_bar"])
    total_samples = int(round(total_beats * seconds_per_beat * sample_rate))
    mix = array("f", [0.0]) * total_samples
    noise_seed = int(score.get("noise_seed", 20260825))

    for channel_index, channel_name in enumerate(("pulse1", "pulse2", "triangle", "noise")):
        channel = score["channels"][channel_name]
        events, _ = expanded_events(score, channel_name)
        level = float(channel.get("level", 0.2))
        for event_index, event in enumerate(events):
            if channel_name.startswith("pulse"):
                add_pulse(mix, event, seconds_per_beat, sample_rate, level, float(channel.get("duty", 0.25)))
            elif channel_name == "triangle":
                add_triangle(mix, event, seconds_per_beat, sample_rate, level)
            else:
                add_noise(mix, event, seconds_per_beat, sample_rate, level, noise_seed + channel_index * 100000 + event_index)

    # NES output stages are AC-coupled and bandwidth-limited.  These simple fixed
    # filters remove pulse DC and soften digital aliasing without hiding chip color.
    high_pass_cutoff = float(score.get("high_pass_hz", 28.0))
    low_pass_cutoff = float(score.get("low_pass_hz", 11800.0))
    dt = 1.0 / sample_rate
    hp_rc = 1.0 / (math.tau * high_pass_cutoff)
    hp_alpha = hp_rc / (hp_rc + dt)
    lp_rc = 1.0 / (math.tau * low_pass_cutoff)
    lp_alpha = dt / (lp_rc + dt)
    previous_input = previous_hp = previous_lp = 0.0
    for index, value in enumerate(mix):
        hp = hp_alpha * (previous_hp + value - previous_input)
        lp = previous_lp + lp_alpha * (hp - previous_lp)
        mix[index] = lp
        previous_input, previous_hp, previous_lp = value, hp, lp

    gain = 10.0 ** (float(score.get("master_gain_db", 0.0)) / 20.0)
    edge_samples = min(total_samples // 4, int(sample_rate * float(score.get("edge_fade_ms", 8.0)) / 1000.0))
    peak_float = 0.0
    pcm = array("h")
    dither_rng = random.Random(int(score.get("dither_seed", 9173)))
    for index, value in enumerate(mix):
        if edge_samples:
            if index < edge_samples:
                value *= 0.5 - 0.5 * math.cos(math.pi * index / edge_samples)
            elif index >= total_samples - edge_samples:
                remaining = total_samples - 1 - index
                value *= 0.5 - 0.5 * math.cos(math.pi * remaining / edge_samples)
        value *= gain
        peak_float = max(peak_float, abs(value))
        dither = (dither_rng.random() - dither_rng.random()) / 65536.0
        quantized = int(round(max(-1.0, min(1.0, value + dither)) * 32767.0))
        pcm.append(quantized)
    if pcm:
        pcm[0] = 0
        pcm[-1] = 0
    stats = {
        "renderer": RENDERER_VERSION,
        "sample_rate": sample_rate,
        "samples": total_samples,
        "duration_seconds": total_samples / sample_rate,
        "pre_quantization_peak": peak_float,
    }
    return pcm, stats


def write_wav(path: Path, pcm: array, sample_rate: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    little_endian = array("h", pcm)
    if sys.byteorder != "little":
        little_endian.byteswap()
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(little_endian.tobytes())


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("score", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--stats", type=Path, help="optional JSON render-statistics output")
    args = parser.parse_args()
    score = load_score(args.score)
    pcm, stats = render(score)
    write_wav(args.output, pcm, int(score.get("sample_rate", 44100)))
    stats["score"] = str(args.score)
    stats["output"] = str(args.output)
    stats["sha256"] = hashlib.sha256(args.output.read_bytes()).hexdigest()
    if args.stats:
        args.stats.parent.mkdir(parents=True, exist_ok=True)
        args.stats.write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(stats, indent=2))
    if stats["pre_quantization_peak"] > 1.0:
        print("error: pre-quantization clipping", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
