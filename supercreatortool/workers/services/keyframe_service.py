from __future__ import annotations
import cv2
from pathlib import Path

def extract_keyframes(video_path: str, fps: int = 1):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError("Unable to open video file")
    out_dir = Path(video_path).with_suffix("").with_name(Path(video_path).stem + "_frames")
    out_dir.mkdir(parents=True, exist_ok=True)
    native_fps = cap.get(cv2.CAP_PROP_FPS) or 30
    step = max(int(native_fps / max(fps, 1)), 1)
    idx, saved = 0, []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if idx % step == 0:
            target = out_dir / f"frame_{idx:06d}.jpg"
            cv2.imwrite(str(target), frame)
            saved.append(str(target))
        idx += 1
    cap.release()
    return str(out_dir), saved
