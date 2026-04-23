from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(os.environ.get("SUPER_CREATOR_DATA_DIR", "E:/SuperCreatorData"))
MEDIA_DIR = BASE_DIR / "media"
TEMP_DIR = BASE_DIR / "temp"
LOGS_DIR = BASE_DIR / "logs"
WHISPER_MODELS_DIR = Path(os.environ.get("WHISPER_MODEL_DIR", str(BASE_DIR / "whisper-models")))


def ensure_worker_dirs() -> None:
    for directory in (BASE_DIR, MEDIA_DIR, TEMP_DIR, LOGS_DIR, WHISPER_MODELS_DIR):
        directory.mkdir(parents=True, exist_ok=True)


def make_temp_dir(prefix: str) -> Path:
    ensure_worker_dirs()
    target = TEMP_DIR / f"{prefix}-{os.urandom(6).hex()}"
    target.mkdir(parents=True, exist_ok=True)
    return target
