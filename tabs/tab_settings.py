from __future__ import annotations

from pathlib import Path
from tkinter import filedialog, messagebox

import customtkinter as ctk

from tabs.base_tab import BaseTab


class TabSettings(BaseTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context)
        self.columnconfigure(1, weight=1)

        ctk.CTkLabel(self, text="Cài đặt", font=ctk.CTkFont(size=22, weight="bold")).grid(
            row=0, column=0, columnspan=2, sticky="w", padx=16, pady=(16, 8)
        )

        ctk.CTkLabel(self, text="Gemini API Key:").grid(row=1, column=0, sticky="w", padx=16, pady=10)
        self.api_key_entry = ctk.CTkEntry(self, show="*")
        self.api_key_entry.grid(row=1, column=1, sticky="ew", padx=16, pady=10)

        ctk.CTkLabel(self, text="Thư mục output:").grid(row=2, column=0, sticky="w", padx=16, pady=10)
        self.output_entry = ctk.CTkEntry(self)
        self.output_entry.grid(row=2, column=1, sticky="ew", padx=16, pady=10)

        ctk.CTkButton(self, text="Chọn thư mục", command=self.pick_output_dir).grid(
            row=3, column=1, sticky="w", padx=16, pady=(0, 10)
        )
        ctk.CTkButton(self, text="Lưu cài đặt", command=self.save_settings).grid(
            row=4, column=1, sticky="w", padx=16, pady=(0, 16)
        )

        self.load_values()

    def load_values(self) -> None:
        self.api_key_entry.delete(0, "end")
        self.api_key_entry.insert(0, self.app.config.get("api.gemini_api_key", ""))
        self.output_entry.delete(0, "end")
        self.output_entry.insert(0, self.app.config.get("paths.output_dir", "data/output"))

    def pick_output_dir(self) -> None:
        path = filedialog.askdirectory(title="Chọn thư mục output")
        if path:
            self.output_entry.delete(0, "end")
            self.output_entry.insert(0, path)

    def save_settings(self) -> None:
        api_key = self.api_key_entry.get().strip()
        output_dir = self.output_entry.get().strip() or "data/output"

        Path(output_dir).mkdir(parents=True, exist_ok=True)
        self.app.config.set("api.gemini_api_key", api_key)
        self.app.config.set("paths.output_dir", output_dir)
        self.app.log_info("Đã lưu cài đặt ứng dụng.")
        messagebox.showinfo("Thành công", "Đã lưu cấu hình.")
