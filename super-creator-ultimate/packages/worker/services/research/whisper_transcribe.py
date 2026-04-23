from __future__ import annotations

from typing import Any

from faster_whisper import WhisperModel

from services.data_paths import WHISPER_MODELS_DIR


_MODEL: WhisperModel | None = None


def _get_model() -> WhisperModel:
    global _MODEL
    if _MODEL is None:
        _MODEL = WhisperModel("base", device="cpu", compute_type="int8", download_root=str(WHISPER_MODELS_DIR))
    return _MODEL


def transcribe_with_words(audio_or_video_path: str) -> dict[str, Any]:
    model = _get_model()
    segments, info = model.transcribe(audio_or_video_path, word_timestamps=True)

    words: list[dict[str, Any]] = []
    text_chunks: list[str] = []
    segment_list: list[dict[str, Any]] = []

    for seg in segments:
        text_chunks.append(seg.text.strip())
        entry = {"start": seg.start, "end": seg.end, "text": seg.text.strip()}
        segment_list.append(entry)
        if seg.words:
            for w in seg.words:
                words.append({"word": w.word, "start": w.start, "end": w.end, "probability": w.probability})

    return {
        "language": info.language,
        "language_probability": info.language_probability,
        "text": " ".join(text_chunks).strip(),
        "segments": segment_list,
        "words": words,
    }
