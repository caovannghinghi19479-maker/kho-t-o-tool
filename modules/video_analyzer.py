"""Phân tích video bằng yt-dlp/ffmpeg/faster-whisper.

Module này cung cấp lớp service tách biệt để các tab có thể gọi lại dễ dàng.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any


class VideoAnalyzer:
    """Service phân tích video (metadata + transcription stub)."""

    def __init__(self, output_dir: str | Path) -> None:
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def get_basic_metadata(self, video_url: str) -> dict[str, Any]:
        """Lấy metadata cơ bản bằng yt-dlp (nếu có)."""
        try:
            from yt_dlp import YoutubeDL
        except Exception as exc:  # pragma: no cover - phụ thuộc môi trường
            raise RuntimeError("Thiếu yt-dlp. Hãy cài requirements.txt") from exc

        opts = {"quiet": True, "skip_download": True}
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(video_url, download=False)

        return {
            "title": info.get("title"),
            "duration": info.get("duration"),
            "channel": info.get("channel") or info.get("uploader"),
            "view_count": info.get("view_count"),
            "webpage_url": info.get("webpage_url"),
        }

    def transcribe_audio_stub(self, media_path: str | Path) -> str:
        """Stub an toàn cho transcription.

        Có thể thay bằng triển khai đầy đủ faster-whisper trong phiên bản tiếp theo.
        """
        path = Path(media_path)
        if not path.exists():
            raise FileNotFoundError(f"Không tìm thấy file: {path}")
        return (
            "[STUB] Chưa kích hoạt pipeline faster-whisper trong bản này. "
            "Hãy tích hợp model và GPU/CPU config trong modules/video_analyzer.py."
        )
