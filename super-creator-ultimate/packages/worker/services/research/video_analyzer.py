from __future__ import annotations

from typing import Any

import cv2
import numpy as np


def _dominant_color(frame: np.ndarray) -> list[int]:
    pixels = frame.reshape((-1, 3)).astype(np.float32)
    mean_color = np.mean(pixels, axis=0)
    return [int(x) for x in mean_color.tolist()]


def analyze_video_metrics(video_path: str) -> dict[str, Any]:
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0

    durations: list[float] = []
    complexity_scores: list[float] = []
    motion_scores: list[float] = []
    palette_samples: list[list[int]] = []

    prev_gray = None
    frame_idx = 0
    change_mark = 0

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 80, 160)
        complexity_scores.append(float(np.mean(edges) / 255.0))

        if frame_idx % int(fps) == 0:
            palette_samples.append(_dominant_color(frame))

        if prev_gray is not None:
            flow = cv2.absdiff(gray, prev_gray)
            motion = float(np.mean(flow) / 255.0)
            motion_scores.append(motion)
            if motion > 0.2:
                durations.append((frame_idx - change_mark) / fps)
                change_mark = frame_idx

        prev_gray = gray
        frame_idx += 1

    cap.release()

    if frame_idx and (not durations or durations[-1] <= 0):
        durations.append((frame_idx - change_mark) / fps)

    return {
        "frames": frame_idx,
        "fps": fps,
        "duration": frame_idx / fps if fps else 0,
        "avg_shot_duration": float(np.mean(durations)) if durations else 0.0,
        "visual_complexity": float(np.mean(complexity_scores)) if complexity_scores else 0.0,
        "motion_score": float(np.mean(motion_scores)) if motion_scores else 0.0,
        "color_palette_samples": palette_samples[:12],
    }
