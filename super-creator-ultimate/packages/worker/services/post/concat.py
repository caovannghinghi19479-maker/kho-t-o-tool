from __future__ import annotations

import tempfile
import subprocess
from pathlib import Path


def concat_videos(video_paths: list[str], output_path: str | None = None) -> str:
    if len(video_paths) < 2:
        raise ValueError("Need at least 2 segments to concat")

    out = output_path or str(Path(video_paths[0]).with_name(f"{Path(video_paths[0]).stem}_concat.mp4"))
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as fp:
        for path in video_paths:
            fp.write(f"file '{path}'\n")
        list_file = fp.name

    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file, "-c", "copy", out]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
