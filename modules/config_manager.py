"""Quản lý cấu hình ứng dụng AutoVeo3Ultimate.

- Lưu config tại data/config.json
- Hỗ trợ đọc/ghi an toàn
- Tách rõ phần default config để dễ mở rộng
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class ConfigManager:
    """Đọc/ghi cấu hình JSON cho ứng dụng desktop."""

    def __init__(self, config_path: str | Path = "data/config.json") -> None:
        self.config_path = Path(config_path)
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        self._config: dict[str, Any] = {}
        self._default_config = {
            "ui": {
                "theme": "dark",
                "language": "vi",
            },
            "paths": {
                "output_dir": "data/output",
            },
            "api": {
                "gemini_api_key": "",
            },
            "automation": {
                "headless": True,
            },
        }

    def load(self) -> dict[str, Any]:
        """Tải cấu hình từ file; nếu chưa có thì tạo mặc định."""
        if not self.config_path.exists():
            self._config = self._default_config.copy()
            self.save()
            return self._config

        try:
            with self.config_path.open("r", encoding="utf-8") as f:
                loaded = json.load(f)
        except (OSError, json.JSONDecodeError):
            loaded = {}

        self._config = self._merge_defaults(loaded)
        self.save()  # đảm bảo key mới luôn được bổ sung vào file
        return self._config

    def save(self) -> None:
        """Lưu cấu hình hiện tại xuống đĩa."""
        if not self._config:
            self._config = self._default_config.copy()
        with self.config_path.open("w", encoding="utf-8") as f:
            json.dump(self._config, f, ensure_ascii=False, indent=2)

    def get(self, dotted_key: str, default: Any = None) -> Any:
        """Lấy giá trị qua dotted notation. Ví dụ: paths.output_dir"""
        if not self._config:
            self.load()
        value: Any = self._config
        for part in dotted_key.split("."):
            if not isinstance(value, dict) or part not in value:
                return default
            value = value[part]
        return value

    def set(self, dotted_key: str, value: Any) -> None:
        """Gán giá trị qua dotted notation và tự động save."""
        if not self._config:
            self.load()
        cursor = self._config
        parts = dotted_key.split(".")
        for part in parts[:-1]:
            cursor = cursor.setdefault(part, {})
        cursor[parts[-1]] = value
        self.save()

    def all(self) -> dict[str, Any]:
        """Trả về toàn bộ config đã nạp."""
        if not self._config:
            self.load()
        return self._config

    def _merge_defaults(self, loaded: dict[str, Any]) -> dict[str, Any]:
        """Merge đệ quy để tránh thiếu key khi nâng cấp version app."""

        def merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
            result: dict[str, Any] = {}
            for key, base_value in base.items():
                if key not in override:
                    result[key] = base_value
                    continue
                override_value = override[key]
                if isinstance(base_value, dict) and isinstance(override_value, dict):
                    result[key] = merge(base_value, override_value)
                else:
                    result[key] = override_value

            for key, value in override.items():
                if key not in result:
                    result[key] = value
            return result

        return merge(self._default_config, loaded)
