from __future__ import annotations

import subprocess
from pathlib import Path


def export_video(video_path: str, resolution: str = "1920x1080", fmt: str = "mp4", crf: int = 20) -> str:
    out = str(Path(video_path).with_suffix(f".{fmt}").with_name(f"{Path(video_path).stem}_export.{fmt}"))
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        video_path,
        "-vf",
        f"scale={resolution}",
        "-c:v",
        "libx264",
        "-crf",
        str(crf),
        "-preset",
        "medium",
        "-c:a",
        "aac",
        out,
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
