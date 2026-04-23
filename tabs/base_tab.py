"""Base class cho các tab trong AutoVeo3Ultimate."""

from __future__ import annotations

import customtkinter as ctk


class BaseTab(ctk.CTkFrame):
    def __init__(self, master, app_context):
        super().__init__(master)
        self.app = app_context
        self.configure(fg_color="#1B1B1B")

    def on_show(self) -> None:
        """Hook khi tab được hiển thị."""
        return
