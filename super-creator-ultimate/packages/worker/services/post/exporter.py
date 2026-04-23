from __future__ import annotations

import subprocess
from pathlib import Path

from services.data_paths import make_temp_dir


def export_video(video_path: str, resolution: str = '1920x1080', fmt: str = 'mp4', crf: int = 20) -> str:
    work_dir = make_temp_dir('export')
    out = str((work_dir / f"{Path(video_path).stem}_export.{fmt}").resolve())

    cmd = [
        'ffmpeg',
        '-y',
        '-i',
        video_path,
        '-vf',
        f'scale={resolution}:force_original_aspect_ratio=decrease,pad={resolution}:(ow-iw)/2:(oh-ih)/2:black',
        '-c:v',
        'libx264',
        '-crf',
        str(crf),
        '-preset',
        'medium',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        out,
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
