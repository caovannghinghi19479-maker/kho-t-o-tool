from __future__ import annotations

import subprocess
from pathlib import Path

from services.data_paths import make_temp_dir


def concat_videos(video_paths: list[str], output_path: str | None = None, transition: str = 'none') -> str:
    if len(video_paths) < 2:
        raise ValueError('Need at least 2 segments to concat')

    work_dir = make_temp_dir('concat')
    out = output_path or str((work_dir / f"{Path(video_paths[0]).stem}_concat.mp4").resolve())

    if transition == 'fade':
        normalized: list[str] = []
        for idx, path in enumerate(video_paths):
            normalized_path = work_dir / f'norm_{idx}.mp4'
            subprocess.run(
                [
                    'ffmpeg',
                    '-y',
                    '-i',
                    path,
                    '-vf',
                    'scale=1920:1080,fps=30,format=yuv420p',
                    '-c:v',
                    'libx264',
                    '-preset',
                    'veryfast',
                    '-crf',
                    '21',
                    '-c:a',
                    'aac',
                    str(normalized_path),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            normalized.append(str(normalized_path))

        if len(normalized) != 2:
            transition = 'none'
        else:
            subprocess.run(
                [
                    'ffmpeg',
                    '-y',
                    '-i',
                    normalized[0],
                    '-i',
                    normalized[1],
                    '-filter_complex',
                    '[0:v][1:v]xfade=transition=fade:duration=0.6:offset=2.4[v];[0:a][1:a]acrossfade=d=0.6[a]',
                    '-map',
                    '[v]',
                    '-map',
                    '[a]',
                    '-c:v',
                    'libx264',
                    '-preset',
                    'medium',
                    '-crf',
                    '20',
                    out,
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            return out

    list_file = work_dir / 'concat_list.txt'
    with list_file.open('w', encoding='utf-8') as fp:
        for path in video_paths:
            fp.write(f"file '{Path(path).resolve().as_posix()}'\n")

    cmd = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(list_file), '-c', 'copy', out]
    subprocess.run(cmd, check=True, capture_output=True, text=True)
    return out
