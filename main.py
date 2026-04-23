from __future__ import annotations

import traceback
from pathlib import Path

import customtkinter as ctk

from modules.config_manager import ConfigManager
from modules.gemini_api import GeminiService
from modules.logger import AppLogger
from modules.video_analyzer import VideoAnalyzer
from modules.veo3_automation import Veo3AutomationService
from tabs.tab_character_sync import TabCharacterSync
from tabs.tab_competitor_clone import TabCompetitorClone
from tabs.tab_create_image import TabCreateImage
from tabs.tab_idea_to_video import TabIdeaToVideo
from tabs.tab_image_to_video import TabImageToVideo
from tabs.tab_settings import TabSettings
from tabs.tab_storyboard import TabStoryboard
from tabs.tab_text_to_video import TabTextToVideo
from tabs.tab_thumbnail import TabThumbnail
from tabs.tab_video_translate import TabVideoTranslate


class AutoVeo3UltimateApp(ctk.CTk):
    def __init__(self) -> None:
        super().__init__()

        self.title("AutoVeo3Ultimate")
        self.geometry("1280x760")
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("dark-blue")

        # Core services
        self.config = ConfigManager("data/config.json")
        self.config.load()

        self.logger = AppLogger(logs_dir="data/logs")
        self.gemini = GeminiService(api_key=self.config.get("api.gemini_api_key", ""))
        self.video_analyzer = VideoAnalyzer(self.config.get("paths.output_dir", "data/output"))
        self.veo3_automation = Veo3AutomationService(
            headless=bool(self.config.get("automation.headless", True))
        )

        self.tabs_registry = {
            "competitor_clone": ("Đối thủ clone", TabCompetitorClone),
            "text_to_video": ("Text → Video", TabTextToVideo),
            "image_to_video": ("Image → Video", TabImageToVideo),
            "idea_to_video": ("Idea → Video", TabIdeaToVideo),
            "character_sync": ("Character Sync", TabCharacterSync),
            "storyboard": ("Storyboard", TabStoryboard),
            "thumbnail": ("Thumbnail", TabThumbnail),
            "create_image": ("Create Image", TabCreateImage),
            "video_translate": ("Video Translate", TabVideoTranslate),
            "settings": ("Cài đặt", TabSettings),
        }

        self._build_layout()
        self._build_sidebar()
        self._build_status_bar()
        self.loaded_tabs: dict[str, ctk.CTkFrame] = {}

        self.logger.bind_ui_callback(self._append_log)
        self.show_tab("competitor_clone")

    def _build_layout(self) -> None:
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.sidebar = ctk.CTkFrame(self, width=230, fg_color="#141414")
        self.sidebar.grid(row=0, column=0, sticky="nsw")

        self.content = ctk.CTkFrame(self, fg_color="#101010")
        self.content.grid(row=0, column=1, sticky="nsew")
        self.content.grid_rowconfigure(0, weight=1)
        self.content.grid_columnconfigure(0, weight=1)

    def _build_sidebar(self) -> None:
        ctk.CTkLabel(
            self.sidebar,
            text="AutoVeo3Ultimate",
            font=ctk.CTkFont(size=18, weight="bold"),
        ).pack(padx=12, pady=(16, 10), anchor="w")

        for tab_key, (label, _) in self.tabs_registry.items():
            ctk.CTkButton(
                self.sidebar,
                text=label,
                anchor="w",
                command=lambda tk_key=tab_key: self.show_tab(tk_key),
            ).pack(fill="x", padx=10, pady=4)

    def _build_status_bar(self) -> None:
        status_frame = ctk.CTkFrame(self, height=130, fg_color="#0D0D0D")
        status_frame.grid(row=1, column=0, columnspan=2, sticky="ew")
        status_frame.grid_columnconfigure(0, weight=1)

        self.status_label = ctk.CTkLabel(status_frame, text="Sẵn sàng", anchor="w")
        self.status_label.grid(row=0, column=0, sticky="ew", padx=10, pady=(8, 4))

        self.log_box = ctk.CTkTextbox(status_frame, height=95)
        self.log_box.grid(row=1, column=0, sticky="ew", padx=10, pady=(0, 8))
        self.log_box.insert("1.0", "Nhật ký hệ thống sẽ hiển thị tại đây...\n")

    def show_tab(self, tab_key: str) -> None:
        try:
            for tab in self.loaded_tabs.values():
                tab.grid_forget()

            if tab_key not in self.loaded_tabs:
                _, tab_cls = self.tabs_registry[tab_key]
                self.loaded_tabs[tab_key] = tab_cls(self.content, self)

            tab = self.loaded_tabs[tab_key]
            tab.grid(row=0, column=0, sticky="nsew")
            if hasattr(tab, "on_show"):
                tab.on_show()

            self.status_label.configure(text=f"Đang mở tab: {self.tabs_registry[tab_key][0]}")
        except Exception as exc:
            self.log_exception(f"Lỗi khi mở tab {tab_key}: {exc}")

    def _append_log(self, line: str) -> None:
        self.log_box.insert("end", line + "\n")
        self.log_box.see("end")

    def log_info(self, message: str) -> None:
        self.status_label.configure(text=message)
        self.logger.info(message)

    def log_warning(self, message: str) -> None:
        self.status_label.configure(text=message)
        self.logger.warning(message)

    def log_error(self, message: str) -> None:
        self.status_label.configure(text=message)
        self.logger.error(message)

    def log_exception(self, message: str) -> None:
        self.status_label.configure(text=message)
        self.logger.exception(message)


def bootstrap_directories() -> None:
    for p in ["data", "data/logs", "data/prompts", "assets"]:
        Path(p).mkdir(parents=True, exist_ok=True)


def main() -> None:
    bootstrap_directories()
    try:
        app = AutoVeo3UltimateApp()
        app.mainloop()
    except Exception:
        print("Ứng dụng gặp lỗi nghiêm trọng:\n" + traceback.format_exc())


if __name__ == "__main__":
    main()
