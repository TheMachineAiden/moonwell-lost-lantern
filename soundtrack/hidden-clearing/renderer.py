#!/usr/bin/env python3
"""Event-score export. No musical material is generated here."""
from __future__ import annotations
import argparse
import hashlib
import json
import math
import re
import struct
import wave
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent
SR = 48000
NOTE = re.compile(r"^([A-G])([#b]?)(-?\d+)$")
PC = dict(C=0, D=2, E=4, F=5, G=7, A=9, B=11)

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def pitch(note):
    if note == "N":
        return 42
    match = NOTE.fullmatch(note)
    if not match:
        raise ValueError(f"Invalid pitch {note}")
    name, accidental, octave = match.groups()
    return 12 * (int(octave) + 1) + PC[name] + {"": 0, "#": 1, "b": -1}[accidental]

def swing_time(beat, swing):
    whole = math.floor(beat + 1e-9)
    fraction = beat - whole
    if fraction <= .5:
        return whole + fraction * 2 * swing
    return whole + swing + (fraction - .5) * 2 * (1 - swing)

def expand(score):
    beats_per_bar = score["meter"][0] * 4 / score["meter"][1]
    total = score["total_bars"] * beats_per_bar
    events = []
    channels = set()
    for name, part in score["parts"].items():
        if part["channel"] in channels:
            raise ValueError("Channel assigned twice")
        channels.add(part["channel"])
        if len(part["bars"]) != score["total_bars"]:
            raise ValueError(f"Wrong bar count: {name}")
        previous_end = 0
        for bar_index, bar in enumerate(part["bars"]):
            for token in bar.split():
                fields = token.split("/")
                if len(fields) not in (3, 4):
                    raise ValueError(f"Invalid token {token}")
                offset, note, length = fields[:3]
                offset, length = float(offset), float(length)
                velocity = float(fields[3]) if len(fields) == 4 else part["default_velocity"]
                start = bar_index * beats_per_bar + offset
                end = start + length
                if not 0 <= offset < beats_per_bar or length <= 0 or not 0 < velocity <= 1:
                    raise ValueError(f"Invalid event {name} bar {bar_index+1}: {token}")
                if start < previous_end - 1e-8 or end > total + 1e-8:
                    raise ValueError(f"Collision/bounds {name} bar {bar_index+1}: {token}; previous end={previous_end}")
                midi = pitch(note)
                if not 24 <= midi <= 96:
                    raise ValueError(f"Pitch out of preview range {note}")
                previous_end = end
                events.append(dict(part=name, channel=part["channel"], bar=bar_index+1,
                    offset=offset, pitch=note, midi=midi, velocity=velocity,
                    start_q=swing_time(start, score["swing"]),
                    end_q=swing_time(end, score["swing"])))
    if channels != {"pulse-1", "pulse-2", "wave", "noise"}:
        raise ValueError("Unexpected DMG role allocation")
    if len(score["harmony"]) != score["total_bars"]:
        raise ValueError("Harmony annotation must match bar count")
    return sorted(events, key=lambda e: (e["start_q"], e["part"]))

def tone(part, event, count, seed):
    t = np.arange(count, dtype=np.float64) / SR
    frequency = 440 * 2 ** ((event["midi"] - 69) / 12)
    if part["instrument"] == "brush":
        rng = np.random.default_rng(seed)
        raw = sosfilt(butter(2, [450, part["cutoff"]], btype="bandpass", fs=SR, output="sos"),
                     rng.uniform(-1, 1, count))
        raw *= np.exp(-t * 26)
    else:
        phase = 2 * np.pi * frequency * t
        raw = np.zeros(count)
        coefficients = []
        max_harmonic = min(40, int(SR * .46 / frequency))
        for harmonic in range(1, max_harmonic + 1):
            if part["instrument"] == "triangle":
                coefficient = ((-1) ** ((harmonic-1)//2)) / harmonic**2 if harmonic % 2 else 0
            else:
                coefficient = math.sin(math.pi * harmonic * part["duty"]) / harmonic
            coefficient *= math.exp(-((harmonic * frequency / part["cutoff"]) ** 2))
            coefficients.append(coefficient)
            raw += coefficient * np.sin(harmonic * phase)
        # A fixed spectral-energy convention makes instrument level meaningful across notes.
        rms = math.sqrt(sum(c*c for c in coefficients) / 2)
        raw *= .55 / max(rms, .001)
    attack = min(count // 4, round(part["attack_ms"] * SR / 1000))
    release = min(count // 3, round(part["release_ms"] * SR / 1000))
    envelope = .82 + .18 * np.exp(-t / .18)
    if attack:
        envelope[:attack] *= np.sin(np.linspace(0, np.pi/2, attack)) ** 2
    if release:
        envelope[-release:] *= np.cos(np.linspace(0, np.pi/2, release)) ** 2
    return raw * envelope * part["level"] * event["velocity"]

def vlq(value):
    output = [value & 127]
    value >>= 7
    while value:
        output.insert(0, 128 | (value & 127)); value >>= 7
    return bytes(output)

def midi_export(score, events, path):
    ppq = 960
    tempo = round(60_000_000 / score["qpm"])
    track = b"\0\xff\x51\x03" + tempo.to_bytes(3, "big")
    track += b"\0\xff\x58\x04" + bytes([score["meter"][0], int(math.log2(score["meter"][1])), 24, 8])
    timeline = []
    for event in events:
        channel = {"lead":0, "inner":1, "bass":2, "noise":9}[event["part"]]
        start, end = round(event["start_q"] * ppq), round(event["end_q"] * ppq)
        timeline.append((start, 1, bytes([0x90+channel, event["midi"], round(event["velocity"]*100)])))
        timeline.append((end, 0, bytes([0x80+channel, event["midi"], 0])))
    previous = 0
    for tick, _, message in sorted(timeline):
        track += vlq(tick - previous) + message; previous = tick
    track += b"\0\xff\x2f\0"
    path.write_bytes(b"MThd" + struct.pack(">IHHH", 6, 0, 1, ppq) + b"MTrk" + struct.pack(">I",len(track)) + track)

def write_wav(path, mono):
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.round(np.clip(mono, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as out:
        out.setnchannels(2); out.setsampwidth(2); out.setframerate(SR)
        out.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())

def render(path, validate_only=False):
    score = json.loads(path.read_text())
    events = expand(score)
    seconds_per_q = 60 / score["qpm"]
    bars = score["total_bars"]
    duration = bars * score["meter"][0] * 4 / score["meter"][1] * seconds_per_q
    name = f"{score['family']}--{score['cue']}"
    derived = ROOT / "derived"; derived.mkdir(exist_ok=True)
    (derived / f"{name}.events.json").write_text(json.dumps(events, indent=2)+"\n")
    midi_export(score, events, derived / f"{name}.mid")
    if validate_only:
        return dict(cue=name, events=len(events), duration=duration)
    samples = round(duration * SR)
    mix = np.zeros(samples, dtype=np.float64)
    for i, event in enumerate(events):
        start = round(event["start_q"] * seconds_per_q * SR)
        end = min(samples, round(event["end_q"] * seconds_per_q * SR))
        mix[start:end] += tone(score["parts"][event["part"]], event, end-start, 17092026+i)
    mix = sosfilt(butter(1, 18, btype="highpass", fs=SR, output="sos"), mix)
    mix -= np.mean(mix)
    fade = round(.004 * SR)
    mix[:fade] *= np.linspace(0, 1, fade)
    mix[-fade:] *= np.linspace(1, 0, fade)
    peak = float(np.max(np.abs(mix)))
    scale = 10 ** (-6.1/20) / peak
    mix *= scale
    wav_path = ROOT / "previews" / f"{name}.wav"
    write_wav(wav_path, mix)
    contract = ["schema_version = 2", f'score_file = "../scores/{score["family"]}/{score["cue"]}.score.json"',
        f'score_sha256 = "{digest(path)}"', f"total_bars = {bars}", f'tempo_bpm = {score["qpm"]}',
        f'meter_beats = {score["meter"][0]}', f'meter_beat_unit = {score["meter"][1]}']
    if score["loop"]:
        contract += ["[loop]", "start_bar = 1", f"end_bar = {bars}"]
    contract += ["[render]", "sample_rate = 48000", "channels = 2", "sample_width_bits = 16",
        "duration_tolerance_seconds = 0.001", "max_peak_dbfs = -6.0", "max_dc_offset = 0.005",
        "loop_boundary_amplitude_delta = 0.01", "loop_boundary_slope_delta = 0.01",
        "silence_threshold_dbfs = -72.0", "expected_silence_spans_seconds = []"]
    (derived / f"{name}.render.toml").write_text("\n".join(contract)+"\n")
    manifest = dict(cue=name, score_sha256=digest(path), renderer_sha256=digest(__file__),
        wav_sha256=digest(wav_path), events_sha256=digest(derived/f"{name}.events.json"),
        frames=samples, duration=samples/SR, qpm=score["qpm"], events=len(events),
        gain=scale, seed=17092026, format="48000 Hz stereo PCM16", listened=False)
    (derived / f"{name}.manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
    return manifest

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    for path in sorted((ROOT/"scores").glob("*/*.score.json")):
        print(json.dumps(render(path, args.validate_only)), flush=True)

if __name__ == "__main__":
    main()
