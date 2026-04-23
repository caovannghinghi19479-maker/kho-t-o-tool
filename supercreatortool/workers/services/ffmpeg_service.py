from __future__ import annotations
import shutil
import subprocess
from pathlib import Path


def ensure_ffmpeg() -> str:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found in PATH. Install ffmpeg or bundle it with the app.")
    return ffmpeg


def extract_audio(video_path: str) -> str:
    ffmpeg = ensure_ffmpeg()
    video = Path(video_path)
    if not video.exists():
        raise RuntimeError(f"Input video does not exist: {video_path}")

    out = video.with_suffix(".wav")
    result = subprocess.run(
        [ffmpeg, "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", str(out)],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg audio extraction failed: {result.stderr.strip()}")
    if not out.exists():
        raise RuntimeError("ffmpeg completed but output audio was not created")
    return str(out)
