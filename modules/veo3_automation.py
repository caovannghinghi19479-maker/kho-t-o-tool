"""Automation layer cho workflow VEO3.

Chỉ cung cấp luồng an toàn, yêu cầu user tự đăng nhập/chấp thuận.
Không có bypass cookie/captcha/quota.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class AutomationResult:
    success: bool
    message: str


class Veo3AutomationService:
    """Stub/service interface cho tự động hóa trình duyệt bằng Playwright."""

    def __init__(self, headless: bool = True) -> None:
        self.headless = headless

    def run_user_authorized_flow(self, prompt: str) -> AutomationResult:
        """Stub workflow.

        Triển khai thật cần:
        1) mở trang chính thức
        2) chờ người dùng đăng nhập thủ công
        3) thao tác trong giới hạn API/UI hợp lệ
        """
        if not prompt.strip():
            return AutomationResult(False, "Prompt trống, không thể chạy automation.")

        return AutomationResult(
            True,
            "[STUB] Workflow Playwright chưa triển khai đầy đủ. "
            "Vui lòng bổ sung selector và quy trình được cấp phép.",
        )
