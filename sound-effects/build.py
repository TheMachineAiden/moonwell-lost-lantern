#!/usr/bin/env python3
"""Render Moonwell's deterministic short sound-effect palette."""

from __future__ import annotations

from array import array
import hashlib
import json
import math
from pathlib import Path
import random
import re
import subprocess
import sys
import tempfile
import wave


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
PALETTE_PATH = ROOT / "palette.json"
OUTPUT = PROJECT / "assets" / "audio" / "sfx"
NOTE_RE = re.compile(r"^([A-Ga-g])([#b]?)(-?\d+)$")
NOTE_BASE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def note_frequency(note: str) -> float:
    match = NOTE_RE.match(note)
    if not match:
        raise ValueError(f"invalid note: {note!r}")
    name, accidental, octave_text = match.groups()
    midi = (int(octave_text) + 1) * 12 + NOTE_BASE[name.upper()]
    midi += 1 if accidental == "#" else -1 if accidental == "b" else 0
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def envelope(index: int, length: int, attack: int, release: int) -> float:
    return min(1.0, (index + 1) / max(1, attack), (length - index) / max(1, release))


def add_tone(mix: array, event: dict, sample_rate: int) -> None:
    start = int(round(float(event["at"]) * sample_rate))
    length = int(round(float(event["duration"]) * sample_rate))
    stop = min(len(mix), start + length)
    attack = int(round(float(event.get("attack_ms", 3)) * sample_rate / 1000))
    release = int(round(float(event.get("release_ms", 40)) * sample_rate / 1000))
    frequency = note_frequency(event["note"])
    end_frequency = note_frequency(event.get("to", event["note"]))
    phase = 0.25 if event["wave"] == "triangle" else 0.0
    duty = float(event.get("duty", 0.25))
    level = float(event["level"])
    pulse_mean = 2.0 * duty - 1.0
    pulse_scale = max(abs(1.0 - pulse_mean), abs(-1.0 - pulse_mean))
    for output_index in range(start, stop):
        local = output_index - start
        progress = local / max(1, length - 1)
        current_frequency = frequency * ((end_frequency / frequency) ** progress)
        if event["wave"] == "triangle":
            raw = 1.0 - 4.0 * abs(phase - 0.5)
            raw = round(raw * 15.0) / 15.0
        elif event["wave"] == "pulse":
            raw = ((1.0 if phase < duty else -1.0) - pulse_mean) / pulse_scale
        else:
            raise ValueError(f"unknown wave: {event['wave']!r}")
        mix[output_index] += raw * envelope(local, length, attack, release) * level
        phase = (phase + current_frequency / sample_rate) % 1.0


def add_noise(mix: array, event: dict, sample_rate: int, seed: int) -> None:
    start = int(round(float(event["at"]) * sample_rate))
    length = int(round(float(event["duration"]) * sample_rate))
    stop = min(len(mix), start + length)
    clock = float(event["clock_hz"])
    level = float(event["level"])
    decay = float(event.get("decay", 5.0))
    rng = random.Random(seed)
    lfsr = rng.randrange(1, 0x7FFF)
    phase = 0.0
    current = -1.0
    for output_index in range(start, stop):
        local = output_index - start
        phase += clock / sample_rate
        while phase >= 1.0:
            feedback = (lfsr ^ (lfsr >> 1)) & 1
            lfsr = (lfsr >> 1) | (feedback << 14)
            current = 1.0 if lfsr & 1 else -1.0
            phase -= 1.0
        progress = local / max(1, length - 1)
        attack = min(1.0, (local + 1) / max(1, int(sample_rate * 0.001)))
        mix[output_index] += current * attack * math.exp(-decay * progress) * level


def render_cue(palette: dict, cue_name: str) -> tuple[array, dict]:
    cue = palette["cues"][cue_name]
    sample_rate = int(palette["sample_rate"])
    total_samples = int(round(float(cue["duration"]) * sample_rate))
    mix = array("f", [0.0]) * total_samples
    for event in cue.get("tones", []):
        add_tone(mix, event, sample_rate)
    seed = int(palette["noise_seed"])
    for event_index, event in enumerate(cue.get("noise", [])):
        add_noise(mix, event, sample_rate, seed + event_index + sum(map(ord, cue_name)))

    # Fixed one-pole high/low-pass stages remove pulse DC and brittle aliasing.
    dt = 1.0 / sample_rate
    hp_rc = 1.0 / (math.tau * 32.0)
    hp_alpha = hp_rc / (hp_rc + dt)
    lp_rc = 1.0 / (math.tau * 8800.0)
    lp_alpha = dt / (lp_rc + dt)
    previous_input = previous_hp = previous_lp = 0.0
    for index, value in enumerate(mix):
        hp = hp_alpha * (previous_hp + value - previous_input)
        lp = previous_lp + lp_alpha * (hp - previous_lp)
        mix[index] = lp
        previous_input, previous_hp, previous_lp = value, hp, lp

    gain = 10.0 ** (float(cue.get("gain_db", 0.0)) / 20.0)
    edge = min(total_samples // 4, int(sample_rate * 0.006))
    dither = random.Random(9173 + sum(map(ord, cue_name)))
    pcm = array("h")
    peak = 0.0
    for index, value in enumerate(mix):
        if index < edge:
            value *= 0.5 - 0.5 * math.cos(math.pi * index / edge)
        elif index >= total_samples - edge:
            remaining = total_samples - 1 - index
            value *= 0.5 - 0.5 * math.cos(math.pi * remaining / edge)
        value *= gain
        peak = max(peak, abs(value))
        value += (dither.random() - dither.random()) / 65536.0
        pcm.append(int(round(max(-1.0, min(1.0, value)) * 32767.0)))
    if pcm:
        pcm[0] = pcm[-1] = 0
    return pcm, {"samples": total_samples, "sample_rate": sample_rate, "duration_seconds": total_samples / sample_rate, "pre_quantization_peak": peak}


def write_wav(path: Path, pcm: array, sample_rate: int) -> None:
    little_endian = array("h", pcm)
    if sys.byteorder != "little":
        little_endian.byteswap()
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(little_endian.tobytes())


def load_palette() -> dict:
    return json.loads(PALETTE_PATH.read_text(encoding="utf-8"))


def build() -> list[dict]:
    palette = load_palette()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    expected = {f"{name}.ogg" for name in palette["cues"]}
    for path in OUTPUT.glob("*.ogg"):
        if path.name not in expected:
            path.unlink()
    reports = []
    with tempfile.TemporaryDirectory(prefix="moonwell-sfx-") as folder:
        temporary = Path(folder)
        for cue_name in palette["cues"]:
            pcm, stats = render_cue(palette, cue_name)
            if stats["pre_quantization_peak"] > 1.0:
                raise ValueError(f"{cue_name}: pre-quantization clipping")
            wav_path = temporary / f"{cue_name}.wav"
            output_path = OUTPUT / f"{cue_name}.ogg"
            write_wav(wav_path, pcm, int(palette["sample_rate"]))
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav_path), "-map_metadata", "-1", "-ac", "2",
                "-ar", str(palette["sample_rate"]), "-c:a", "vorbis", "-q:a", "3", "-strict", "experimental",
                "-metadata", f"title=Moonwell {cue_name}",
                "-metadata", "artist=Original Moonwell sound-effect palette",
                str(output_path),
            ], check=True)
            reports.append({"cue": cue_name, **stats, "bytes": output_path.stat().st_size, "sha256": hashlib.sha256(output_path.read_bytes()).hexdigest()})
    return reports


if __name__ == "__main__":
    print(json.dumps(build(), indent=2))
