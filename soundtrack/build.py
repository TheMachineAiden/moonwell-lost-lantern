#!/usr/bin/env python3
"""Render Moonwell's editable scores and encode production Ogg/Vorbis cues."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import tempfile

import render as chip_render


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
SCORES = ROOT / "scores"
OUTPUT = PROJECT / "assets" / "audio"
CUES = {
    "lantern_before_dawn": "lantern-before-dawn.ogg",
    "lanterns_through_leaves": "lanterns-through-leaves.ogg",
    "lantern_home": "lantern-home.ogg",
}
DEFAULT_CUES = ("lantern_before_dawn", "lantern_home")


def encode(score_path: Path, output_path: Path, temporary: Path) -> dict:
    score = chip_render.load_score(score_path)
    pcm, stats = chip_render.render(score)
    wav_path = temporary / f"{score_path.stem}.wav"
    chip_render.write_wav(wav_path, pcm, int(score.get("sample_rate", 44100)))
    samples = len(pcm)
    metadata = score["metadata"]
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(wav_path), "-map_metadata", "-1", "-ac", "2",
        "-c:a", "vorbis", "-q:a", "6", "-strict", "experimental",
        "-metadata", f"title={metadata['title']}",
        "-metadata", "album=Moonwell: The Lost Lantern — soundtrack alternatives",
        "-metadata", "artist=Original Moonwell concept score",
        "-metadata", f"comment={metadata['mood']}",
        "-metadata", "LOOPSTART=0",
        "-metadata", f"LOOPLENGTH={samples}",
        str(output_path),
    ]
    subprocess.run(command, check=True)
    return {
        "cue": score_path.stem,
        "duration_seconds": round(stats["duration_seconds"], 6),
        "samples": samples,
        "pre_quantization_peak": round(stats["pre_quantization_peak"], 6),
        "output": str(output_path.relative_to(PROJECT)),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cues", nargs="*", choices=sorted(CUES), default=list(DEFAULT_CUES))
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    reports = []
    with tempfile.TemporaryDirectory(prefix="moonwell-audio-") as folder:
        temporary = Path(folder)
        for slug in args.cues:
            reports.append(encode(SCORES / f"{slug}.json", OUTPUT / CUES[slug], temporary))
    print(json.dumps(reports, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
