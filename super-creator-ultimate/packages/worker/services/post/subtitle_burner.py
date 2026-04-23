from __future__ import annotations

import subprocess
from pathlib import Path

from services.data_paths import make_temp_dir


def _escape_subtitle_path(path: str) -> str:
    return path.replace('\\', '/').replace(':', '\\:').replace("'", "\\'")


def burn_subtitles(video_path: str, srt_path: str, output_path: str | None = None) -> str:
    temp_dir = make_temp_dir('subtitle-burn')
    out = output_path or str((temp_dir / f"{Path(video_path).stem}_subbed.mp4").resolve())

    cmd = [
        'ffmpeg',
        '-y',
        '-i',
        video_path,
        '-vf',
        f"subtitles='{_escape_subtitle_path(srt_path)}':force_style='FontName=Arial,FontSize=24,Outline=1,Shadow=0'",
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '20',
        '-c:a',
        'copy',
        out,
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
