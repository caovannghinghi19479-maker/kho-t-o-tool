"""Logger tiện dụng cho ứng dụng GUI.

- Ghi file vào data/logs/
- Có callback để đẩy log ra giao diện theo thời gian thực
"""

from __future__ import annotations

import logging
from datetime import datetime
from pathlib import Path
from typing import Callable


class AppLogger:
    """Wrapper quanh logging để dùng nhất quán toàn app."""

    def __init__(self, name: str = "AutoVeo3Ultimate", logs_dir: str | Path = "data/logs") -> None:
        self.logs_dir = Path(logs_dir)
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        log_filename = datetime.now().strftime("%Y-%m-%d") + ".log"

        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        self.logger.handlers.clear()

        formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(message)s")

        file_handler = logging.FileHandler(self.logs_dir / log_filename, encoding="utf-8")
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

        self._ui_callback: Callable[[str], None] | None = None

    def bind_ui_callback(self, callback: Callable[[str], None]) -> None:
        self._ui_callback = callback

    def info(self, message: str) -> None:
        self.logger.info(message)
        self._push_ui("INFO", message)

    def warning(self, message: str) -> None:
        self.logger.warning(message)
        self._push_ui("CẢNH BÁO", message)

    def error(self, message: str) -> None:
        self.logger.error(message)
        self._push_ui("LỖI", message)

    def exception(self, message: str) -> None:
        self.logger.exception(message)
        self._push_ui("EXCEPTION", message)

    def _push_ui(self, level: str, message: str) -> None:
        if self._ui_callback:
            timestamp = datetime.now().strftime("%H:%M:%S")
            self._ui_callback(f"[{timestamp}] {level}: {message}")
