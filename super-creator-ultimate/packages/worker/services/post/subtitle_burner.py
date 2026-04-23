from __future__ import annotations

import subprocess
from pathlib import Path


def burn_subtitles(video_path: str, srt_path: str, output_path: str | None = None) -> str:
    out = output_path or str(Path(video_path).with_name(f"{Path(video_path).stem}_subbed.mp4"))
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        video_path,
        "-vf",
        f"subtitles={srt_path}",
        "-c:a",
        "copy",
        out,
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
