from __future__ import annotations

import subprocess
from pathlib import Path


def overlay_audio(video_path: str, audio_path: str, output_path: str | None = None, audio_gain: float = 1.0) -> str:
    out = output_path or str(Path(video_path).with_name(f"{Path(video_path).stem}_mix.mp4"))
    filter_complex = f"[1:a]volume={audio_gain}[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]"
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        video_path,
        "-i",
        audio_path,
        "-filter_complex",
        filter_complex,
        "-map",
        "0:v",
        "-map",
        "[aout]",
        "-c:v",
        "copy",
        out,
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
