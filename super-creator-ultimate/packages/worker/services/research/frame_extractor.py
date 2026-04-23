from __future__ import annotations

import os
from typing import Any

import cv2
import numpy as np

from services.data_paths import make_temp_dir


def extract_scene_keyframes(video_path: str, threshold: float = 22.0) -> dict[str, Any]:
    capture = cv2.VideoCapture(video_path)
    output_dir = make_temp_dir("sct-keyframes")

    prev_gray = None
    frame_idx = 0
    saved: list[str] = []
    diffs: list[float] = []

    while True:
        ok, frame = capture.read()
        if not ok:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if prev_gray is not None:
            diff = float(np.mean(cv2.absdiff(gray, prev_gray)))
            diffs.append(diff)
            if diff >= threshold:
                path = os.path.join(str(output_dir), f"scene_{frame_idx}.jpg")
                cv2.imwrite(path, frame)
                saved.append(path)
        elif frame_idx == 0:
            path = os.path.join(str(output_dir), "scene_0.jpg")
            cv2.imwrite(path, frame)
            saved.append(path)

        prev_gray = gray
        frame_idx += 1

    fps = capture.get(cv2.CAP_PROP_FPS) or 24.0
    capture.release()

    return {
        "keyframes": saved,
        "scene_change_threshold": threshold,
        "frames_processed": frame_idx,
        "estimated_duration": frame_idx / fps,
        "avg_scene_diff": float(np.mean(diffs)) if diffs else 0.0,
    }
