#!/usr/bin/env python3
"""Verify retained sources and production files for Moonwell sound effects."""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
import sys

import build as sound_build


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
OUTPUT = PROJECT / "assets" / "audio" / "sfx"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def pcm_bytes(pcm) -> bytes:
    copy = pcm[:]
    if sys.byteorder != "little":
        copy.byteswap()
    return copy.tobytes()


def probe(path: Path) -> dict:
    return json.loads(subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,sample_rate,channels",
        "-of", "json", str(path),
    ], check=True, capture_output=True, text=True).stdout)


def loudness(path: Path) -> tuple[float, float]:
    result = subprocess.run([
        "ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
        "-filter_complex", "ebur128=peak=true", "-f", "null", "-",
    ], capture_output=True, text=True)
    integrated = re.findall(r"\n\s+I:\s+(-?[0-9.]+) LUFS", result.stderr)
    peaks = re.findall(r"\n\s+Peak:\s+(-?[0-9.]+) dBFS", result.stderr)
    if result.returncode or not integrated or not peaks:
        raise RuntimeError(f"could not measure {path}")
    return float(integrated[-1]), float(peaks[-1])


def main() -> int:
    palette = sound_build.load_palette()
    expected = sorted(f"{name}.ogg" for name in palette["cues"])
    actual = sorted(path.name for path in OUTPUT.glob("*.ogg"))
    reports = []
    checks = [actual == expected]
    for cue_name, source in palette["cues"].items():
        first, first_stats = sound_build.render_cue(palette, cue_name)
        second, second_stats = sound_build.render_cue(palette, cue_name)
        path = OUTPUT / f"{cue_name}.ogg"
        info = probe(path)
        stream = info["streams"][0]
        duration = float(info["format"]["duration"])
        integrated, peak = loudness(path)
        runtime_lufs = integrated + 20.0 * math.log10(0.82)
        cue_checks = {
            "deterministic_pcm": sha256_bytes(pcm_bytes(first)) == sha256_bytes(pcm_bytes(second)),
            "deterministic_stats": first_stats == second_stats,
            "not_clipped": first_stats["pre_quantization_peak"] <= 1.0,
            "vorbis_stereo_22050": stream.get("codec_name") == "vorbis" and stream.get("channels") == 2 and stream.get("sample_rate") == "22050",
            "duration": abs(duration - float(source["duration"])) <= 0.03,
            "audible_loudness": -36.0 <= integrated <= -19.0,
            "balanced_runtime_output": -31.0 <= runtime_lufs <= -24.0,
            "conservative_peak": peak <= -6.0,
            "small_asset": path.stat().st_size <= 18000,
        }
        checks.extend(cue_checks.values())
        reports.append({cue_name: {"duration_seconds": duration, "integrated_lufs": integrated, "runtime_lufs_at_master": round(runtime_lufs, 1), "true_peak_dbtp": peak, "bytes": path.stat().st_size, "pcm_sha256": sha256_bytes(pcm_bytes(first)), "checks": cue_checks}})
    result = {"ok": all(checks), "production_files": actual, "reports": reports}
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
