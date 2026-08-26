#!/usr/bin/env python3
"""Verify Moonwell's checked-in soundtrack masters and deterministic sources."""

from __future__ import annotations

from array import array
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

import render as chip_render


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
EXPECTED = {
    "lantern-before-dawn.ogg": {"duration": (14.2, 14.4), "lufs": (-27.0, -24.0), "loop": False},
    "lanterns-through-leaves.ogg": {"duration": (68.5, 68.7), "lufs": (-17.5, -16.5), "loop": True},
    "lantern-home.ogg": {"duration": (11.3, 11.6), "lufs": (-21.0, -18.5), "loop": False},
}
CANONICAL = {
    "lanterns-through-leaves.ogg": "94884630895e04a59ef99a8ce954b7900e37eafec5a295d2007e99e5cc12db8b",
    "lanterns_through_leaves.json": "a5e0807707180389d069fec3507dd124b6665eb965c18f1717d9daee6fef5893",
    "render.py": "b6ed7c6aa63fcaf11d83881943b8e9ebc844a961b26d6ba1b0b072eb7ce580da",
}


def output(command: list[str], *, binary: bool = False):
    return subprocess.run(command, check=True, capture_output=True, text=not binary).stdout


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def probe(path: Path) -> dict:
    return json.loads(output([
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration:stream=codec_name,sample_rate,channels:stream_tags=title,LOOPSTART,LOOPLENGTH",
        "-of", "json", str(path),
    ]))


def loudness(path: Path) -> tuple[float, float]:
    result = subprocess.run([
        "ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
        "-filter_complex", "ebur128=peak=true", "-f", "null", "-",
    ], capture_output=True, text=True, check=False)
    integrated_values = re.findall(r"\n\s+I:\s+(-?[0-9.]+) LUFS", result.stderr)
    peak_values = re.findall(r"\n\s+Peak:\s+(-?[0-9.]+) dBFS", result.stderr)
    if result.returncode or not integrated_values or not peak_values:
        raise RuntimeError(f"could not measure {path}")
    integrated, peak = integrated_values[-1], peak_values[-1]
    return float(integrated), float(peak)


def decoded_mono(path: Path) -> array:
    raw = output(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-f", "s16le", "-"], binary=True)
    pcm = array("h")
    pcm.frombytes(raw)
    if sys.byteorder != "little":
        pcm.byteswap()
    return pcm


def verify_sources() -> list[dict]:
    reports = []
    renderer = ROOT / "render.py"
    selected_score = ROOT / "scores" / "lanterns_through_leaves.json"
    selected_master = PROJECT / "assets" / "audio" / "lanterns-through-leaves.ogg"
    checks = {
        "selected_master_hash": sha256(selected_master) == CANONICAL[selected_master.name],
        "selected_score_hash": sha256(selected_score) == CANONICAL[selected_score.name],
        "renderer_hash": sha256(renderer) == CANONICAL[renderer.name],
    }
    reports.append({"source_identity": checks})
    with tempfile.TemporaryDirectory(prefix="moonwell-source-check-") as folder:
        temporary = Path(folder)
        for slug in ("lantern_before_dawn", "lantern_home"):
            score = chip_render.load_score(ROOT / "scores" / f"{slug}.json")
            pcm_a, stats_a = chip_render.render(score)
            pcm_b, stats_b = chip_render.render(score)
            wav_a, wav_b = temporary / f"{slug}-a.wav", temporary / f"{slug}-b.wav"
            chip_render.write_wav(wav_a, pcm_a, 44100)
            chip_render.write_wav(wav_b, pcm_b, 44100)
            reports.append({slug: {
                "duration_seconds": round(stats_a["duration_seconds"], 6),
                "deterministic_pcm": sha256(wav_a) == sha256(wav_b),
                "not_clipped": stats_a["pre_quantization_peak"] <= 1.0 and stats_b["pre_quantization_peak"] <= 1.0,
            }})
    return reports


def main() -> int:
    audio_dir = PROJECT / "assets" / "audio"
    names = sorted(path.name for path in audio_dir.iterdir() if path.is_file())
    reports = verify_sources()
    checks = [names == sorted(EXPECTED)]
    for name, expectation in EXPECTED.items():
        path = audio_dir / name
        info = probe(path)
        stream = info["streams"][0]
        tags = stream.get("tags", {})
        duration = float(info["format"]["duration"])
        integrated, peak = loudness(path)
        cue_checks = {
            "vorbis_stereo_44100": stream.get("codec_name") == "vorbis" and stream.get("channels") == 2 and stream.get("sample_rate") == "44100",
            "duration": expectation["duration"][0] <= duration <= expectation["duration"][1],
            "loudness": expectation["lufs"][0] <= integrated <= expectation["lufs"][1],
            "true_peak": peak <= -3.0,
            "title": bool(tags.get("title")),
        }
        if expectation["loop"]:
            pcm = decoded_mono(path)
            cue_checks["loop_metadata"] = tags.get("LOOPSTART") == "0" and int(tags.get("LOOPLENGTH", -1)) == len(pcm)
            cue_checks["decoded_seam"] = abs(pcm[0] - pcm[-1]) / 32768.0 <= 0.01
        checks.extend(cue_checks.values())
        reports.append({name: {"duration_seconds": round(duration, 6), "integrated_lufs": integrated, "true_peak_dbtp": peak, "checks": cue_checks}})
    for report in reports[:3]:
        checks.extend(next(iter(report.values())).values())
    result = {"ok": all(checks), "production_files": names, "reports": reports}
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
