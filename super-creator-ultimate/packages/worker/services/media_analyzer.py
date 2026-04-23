from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import List

import cv2
from faster_whisper import WhisperModel

from services.data_paths import WHISPER_MODELS_DIR, make_temp_dir


@dataclass
class CompetitorAnalysisResult:
    transcript: str
    keyframes: List[str]
    summary: str


class MediaAnalyzer:
    def __init__(self, whisper_model_name: str = "base") -> None:
        self.whisper_model = WhisperModel(
            whisper_model_name,
            device="cpu",
            compute_type="int8",
            download_root=str(WHISPER_MODELS_DIR),
        )

    def download_video(self, source_url: str) -> str:
        output_dir = make_temp_dir("sct-video")
        output_template = os.path.join(str(output_dir), "input.%(ext)s")
        subprocess.run(
            [
                "yt-dlp",
                "-f",
                "mp4/best",
                "-o",
                output_template,
                source_url,
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        files = list(output_dir.glob("input.*"))
        if not files:
            raise RuntimeError("Failed to download video with yt-dlp")
        return str(files[0])

    def extract_keyframes(self, video_path: str, every_n_seconds: int = 3) -> List[str]:
        capture = cv2.VideoCapture(video_path)
        fps = capture.get(cv2.CAP_PROP_FPS) or 24
        frame_interval = int(fps * every_n_seconds)
        output_dir = make_temp_dir("sct-frames")

        frame_idx = 0
        saved = []

        while True:
            success, frame = capture.read()
            if not success:
                break
            if frame_idx % frame_interval == 0:
                frame_path = os.path.join(str(output_dir), f"frame_{frame_idx}.jpg")
                cv2.imwrite(frame_path, frame)
                saved.append(frame_path)
            frame_idx += 1

        capture.release()
        return saved

    def transcribe(self, video_path: str) -> str:
        segments, _ = self.whisper_model.transcribe(video_path)
        return " ".join([segment.text.strip() for segment in segments if segment.text])
