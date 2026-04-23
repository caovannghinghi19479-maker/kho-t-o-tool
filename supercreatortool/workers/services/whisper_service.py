from __future__ import annotations
from typing import Optional

_model = None


def get_model(model_size: str = "base"):
    global _model
    if _model is None:
        try:
            from faster_whisper import WhisperModel
        except Exception as exc:
            raise RuntimeError("faster-whisper is not installed or failed to import") from exc
        _model = WhisperModel(model_size, device="cpu", compute_type="int8")
    return _model


def transcribe(audio_path: str, language: str = "auto", model_size: str = "base"):
    model = get_model(model_size)
    segments, _ = model.transcribe(audio_path, language=None if language == "auto" else language)
    parsed = []
    full = []
    for segment in segments:
        parsed.append({"start": float(segment.start), "end": float(segment.end), "text": segment.text.strip()})
        full.append(segment.text.strip())
    return " ".join(filter(None, full)).strip(), parsed
