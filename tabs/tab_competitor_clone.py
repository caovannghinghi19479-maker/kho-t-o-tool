from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox

import customtkinter as ctk

from tabs.base_tab import BaseTab


class TabCompetitorClone(BaseTab):
    """Tab đầy đủ đầu tiên: clone ý tưởng video đối thủ theo hướng hợp pháp."""

    def __init__(self, master, app_context):
        super().__init__(master, app_context)

        self.columnconfigure(0, weight=1)
        self.rowconfigure(3, weight=1)

        header = ctk.CTkLabel(
            self,
            text="Đối thủ → Kịch bản mới",
            font=ctk.CTkFont(size=22, weight="bold"),
        )
        header.grid(row=0, column=0, sticky="w", padx=16, pady=(16, 8))

        form = ctk.CTkFrame(self, fg_color="#242424")
        form.grid(row=1, column=0, sticky="ew", padx=16, pady=8)
        form.columnconfigure(1, weight=1)

        ctk.CTkLabel(form, text="URL video đối thủ:").grid(row=0, column=0, padx=12, pady=10, sticky="w")
        self.url_entry = ctk.CTkEntry(form, placeholder_text="https://...")
        self.url_entry.grid(row=0, column=1, padx=12, pady=10, sticky="ew")

        ctk.CTkLabel(form, text="Ngách / Chủ đề:").grid(row=1, column=0, padx=12, pady=10, sticky="w")
        self.niche_entry = ctk.CTkEntry(form, placeholder_text="Ví dụ: du lịch, tài chính, công nghệ...")
        self.niche_entry.grid(row=1, column=1, padx=12, pady=10, sticky="ew")

        btn_row = ctk.CTkFrame(self, fg_color="transparent")
        btn_row.grid(row=2, column=0, sticky="ew", padx=16, pady=8)

        ctk.CTkButton(btn_row, text="Phân tích metadata", command=self.handle_analyze).pack(side="left", padx=(0, 8))
        ctk.CTkButton(btn_row, text="Tạo prompt clone", command=self.handle_generate).pack(side="left", padx=(0, 8))
        ctk.CTkButton(btn_row, text="Copy", command=self.handle_copy).pack(side="left", padx=(0, 8))
        ctk.CTkButton(btn_row, text="Lưu .txt", command=self.handle_save_txt).pack(side="left", padx=(0, 8))
        ctk.CTkButton(btn_row, text="Export JSON", command=self.handle_export_json).pack(side="left")

        self.editor = ctk.CTkTextbox(self, wrap="word")
        self.editor.grid(row=3, column=0, sticky="nsew", padx=16, pady=(8, 16))
        self.editor.insert("1.0", "Kết quả sẽ xuất hiện tại đây. Bạn có thể chỉnh sửa trước khi copy/export.")

    def handle_analyze(self) -> None:
        url = self.url_entry.get().strip()
        if not url:
            messagebox.showwarning("Thiếu dữ liệu", "Vui lòng nhập URL video.")
            return

        try:
            metadata = self.app.video_analyzer.get_basic_metadata(url)
            content = [
                "=== METADATA VIDEO ĐỐI THỦ ===",
                f"Tiêu đề: {metadata.get('title')}",
                f"Kênh: {metadata.get('channel')}",
                f"Thời lượng (s): {metadata.get('duration')}",
                f"Lượt xem: {metadata.get('view_count')}",
                f"URL: {metadata.get('webpage_url')}",
            ]
            self.editor.delete("1.0", tk.END)
            self.editor.insert("1.0", "\n".join(content))
            self.app.log_info("Đã phân tích metadata video đối thủ thành công.")
        except Exception as exc:
            self.app.log_exception(f"Phân tích metadata thất bại: {exc}")
            messagebox.showerror("Lỗi", f"Không thể phân tích video: {exc}")

    def handle_generate(self) -> None:
        url = self.url_entry.get().strip()
        niche = self.niche_entry.get().strip() or "tổng quát"

        base_prompt = (
            "Bạn là chuyên gia sáng tạo video. Hãy phân tích video tham chiếu và tạo một ý tưởng mới "
            "mang phong cách riêng, không sao chép nguyên bản.\n"
            f"Video tham chiếu: {url or '[không có URL]'}\n"
            f"Ngách: {niche}\n"
            "Yêu cầu đầu ra:\n"
            "1) Hook 5 giây\n2) Dàn ý 5 cảnh\n3) CTA\n4) Gợi ý thumbnail\n5) Prompt text-to-video"
        )

        try:
            gemini_key = self.app.config.get("api.gemini_api_key", "")
            if gemini_key:
                self.app.gemini.api_key = gemini_key
                output = self.app.gemini.generate_text(base_prompt)
                final_text = output or "Gemini trả về rỗng."
            else:
                final_text = (
                    "[CHẾ ĐỘ OFFLINE/STUB]\n"
                    "Chưa cấu hình Gemini API key nên ứng dụng tạo prompt mẫu:\n\n"
                    + base_prompt
                )

            self.editor.delete("1.0", tk.END)
            self.editor.insert("1.0", final_text)
            self.app.log_info("Đã tạo prompt clone đối thủ.")
        except Exception as exc:
            self.app.log_exception(f"Tạo prompt thất bại: {exc}")
            messagebox.showerror("Lỗi", str(exc))

    def handle_copy(self) -> None:
        text = self.editor.get("1.0", tk.END).strip()
        if not text:
            return
        self.clipboard_clear()
        self.clipboard_append(text)
        self.app.log_info("Đã copy nội dung prompt vào clipboard.")

    def handle_save_txt(self) -> None:
        text = self.editor.get("1.0", tk.END).strip()
        if not text:
            messagebox.showwarning("Rỗng", "Không có nội dung để lưu.")
            return

        default_name = f"competitor_clone_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        file_path = filedialog.asksaveasfilename(
            title="Lưu prompt",
            defaultextension=".txt",
            initialfile=default_name,
            filetypes=[("Text", "*.txt"), ("All files", "*.*")],
        )
        if not file_path:
            return

        Path(file_path).write_text(text, encoding="utf-8")
        self.app.log_info(f"Đã lưu file: {file_path}")

    def handle_export_json(self) -> None:
        data = {
            "type": "competitor_clone",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "video_url": self.url_entry.get().strip(),
            "niche": self.niche_entry.get().strip(),
            "content": self.editor.get("1.0", tk.END).strip(),
        }

        output_dir = Path(self.app.config.get("paths.output_dir", "data/output"))
        output_dir.mkdir(parents=True, exist_ok=True)
        out_file = output_dir / f"competitor_clone_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        out_file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

        self.app.log_info(f"Đã export JSON: {out_file}")
        messagebox.showinfo("Thành công", f"Đã export:\n{out_file}")
