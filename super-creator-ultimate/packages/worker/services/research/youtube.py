from __future__ import annotations

import json
import os
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class YouTubeResearchResult:
    video_path: str
    audio_path: str
    metadata: dict[str, Any]
    transcript: str


def _run_json(command: list[str]) -> dict[str, Any]:
    process = subprocess.run(command, check=True, capture_output=True, text=True)
    return json.loads(process.stdout)


def fetch_metadata(url: str) -> dict[str, Any]:
    return _run_json(["yt-dlp", "--dump-single-json", "--no-warnings", url])


def download_video_audio(url: str) -> tuple[str, str]:
    output_dir = tempfile.mkdtemp(prefix="sct-yt-")
    video_template = os.path.join(output_dir, "video.%(ext)s")
    audio_template = os.path.join(output_dir, "audio.%(ext)s")

    subprocess.run(["yt-dlp", "-f", "mp4/best", "-o", video_template, url], check=True, capture_output=True, text=True)
    subprocess.run(["yt-dlp", "-f", "bestaudio", "-o", audio_template, url], check=True, capture_output=True, text=True)

    video_files = list(Path(output_dir).glob("video.*"))
    audio_files = list(Path(output_dir).glob("audio.*"))
    if not video_files or not audio_files:
        raise RuntimeError("yt-dlp download failed")
    return str(video_files[0]), str(audio_files[0])


def extract_transcript(url: str) -> str:
    try:
        metadata = fetch_metadata(url)
        subtitles = metadata.get("subtitles") or metadata.get("automatic_captions") or {}
        for _lang, tracks in subtitles.items():
            if tracks:
                return f"Transcript track available: {tracks[0].get('name', 'unknown')}"
    except Exception:
        pass
    return "Transcript unavailable from source metadata; use whisper transcription endpoint."


def research_youtube(url: str) -> YouTubeResearchResult:
    metadata = fetch_metadata(url)
    video_path, audio_path = download_video_audio(url)
    transcript = extract_transcript(url)
    return YouTubeResearchResult(video_path=video_path, audio_path=audio_path, metadata=metadata, transcript=transcript)
