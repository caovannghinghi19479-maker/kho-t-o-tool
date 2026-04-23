from __future__ import annotations

import customtkinter as ctk

from tabs.base_tab import BaseTab


class PlaceholderTab(BaseTab):
    def __init__(self, master, app_context, title: str, description: str):
        super().__init__(master, app_context)
        self.columnconfigure(0, weight=1)

        ctk.CTkLabel(self, text=title, font=ctk.CTkFont(size=22, weight="bold")).grid(
            row=0, column=0, padx=16, pady=(16, 8), sticky="w"
        )
        ctk.CTkTextbox(self, height=360).grid(row=1, column=0, padx=16, pady=8, sticky="nsew")

        note = ctk.CTkLabel(
            self,
            text=(
                f"{description}\n\n"
                "[STUB] Tab này đang ở dạng khung kiến trúc. "
                "Bạn có thể triển khai service thực tế trong modules/ tương ứng."
            ),
            justify="left",
            anchor="w",
        )
        note.grid(row=2, column=0, padx=16, pady=(0, 16), sticky="w")
