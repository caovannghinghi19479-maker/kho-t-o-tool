"""Service client cho Gemini API (stub an toàn + triển khai cơ bản REST)."""

from __future__ import annotations

import os
from typing import Any

import requests


class GeminiAPIError(RuntimeError):
    """Lỗi khi gọi Gemini API."""


class GeminiService:
    """Service gọi Gemini thông qua API key do người dùng cung cấp."""

    BASE_URL = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-1.5-flash:generateContent"
    )

    def __init__(self, api_key: str | None = None, timeout: int = 45) -> None:
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.timeout = timeout

    def generate_text(self, prompt: str) -> str:
        """Sinh text từ Gemini. Nếu thiếu API key thì trả lỗi rõ ràng."""
        if not self.api_key:
            raise GeminiAPIError("Thiếu Gemini API key. Vui lòng cấu hình trong tab Cài đặt.")

        params = {"key": self.api_key}
        payload: dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024},
        }

        try:
            response = requests.post(
                self.BASE_URL,
                params=params,
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()
            return (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
                .strip()
            )
        except requests.RequestException as exc:
            raise GeminiAPIError(f"Lỗi mạng/Gemini API: {exc}") from exc
        except (ValueError, IndexError, KeyError) as exc:
            raise GeminiAPIError("Phản hồi Gemini không đúng định dạng.") from exc
