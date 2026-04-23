# AutoVeo3Ultimate

Ứng dụng desktop Python (CustomTkinter) dành cho quy trình sáng tạo video, thiết kế theo hướng module hóa, an toàn với API và dễ mở rộng.

## 1) Cấu trúc thư mục

```
AutoVeo3Ultimate/
├─ main.py
├─ requirements.txt
├─ build_exe.bat
├─ README.md
├─ assets/
├─ data/
│  ├─ config.json (tự tạo lần đầu)
│  ├─ logs/
│  └─ prompts/
├─ modules/
│  ├─ config_manager.py
│  ├─ logger.py
│  ├─ gemini_api.py
│  ├─ video_analyzer.py
│  └─ veo3_automation.py
└─ tabs/
   ├─ base_tab.py
   ├─ tab_competitor_clone.py
   ├─ tab_text_to_video.py
   ├─ tab_image_to_video.py
   ├─ tab_idea_to_video.py
   ├─ tab_character_sync.py
   ├─ tab_storyboard.py
   ├─ tab_thumbnail.py
   ├─ tab_create_image.py
   ├─ tab_video_translate.py
   └─ tab_settings.py
```

## 2) Yêu cầu môi trường

- Python 3.11+
- ffmpeg có trong PATH (nếu dùng pipeline media nâng cao)
- Windows 10/11 (để build `.exe` bằng batch script)

## 3) Chạy local

### Windows (PowerShell hoặc CMD)

```bat
py -3.11 -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m playwright install chromium
python main.py
```

### Linux/macOS (dev/test)

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m playwright install chromium
python main.py
```

## 4) Build Windows EXE

Chạy file:

```bat
build_exe.bat
```

Kết quả tại:

- `dist/AutoVeo3Ultimate/AutoVeo3Ultimate.exe`

## 5) Quy tắc bảo mật & tích hợp dịch vụ

- API key (Gemini) lưu trong `data/config.json` hoặc biến môi trường.
- Không hardcode credentials trong source.
- Chỉ hỗ trợ luồng chính thức hoặc user-authorized workflow.
- Không triển khai bypass cookie/captcha/quota.
- Các phần phụ thuộc endpoint private được đánh dấu **[STUB]**.

## 6) Tab hiện có

- ✅ `Competitor Clone` (đã hoạt động):
  - nhập URL đối thủ + ngách
  - phân tích metadata bằng `yt-dlp`
  - tạo prompt clone (Gemini nếu có key, fallback stub nếu chưa có)
  - chỉnh sửa output trực tiếp
  - copy, lưu `.txt`, export `.json`
- ✅ `Settings` (đã hoạt động):
  - lưu Gemini API key
  - cấu hình thư mục output
- 🧩 Các tab còn lại đang là khung kiến trúc để mở rộng.

## 7) Những gì đang là stub/chưa hoàn tất

- `modules/veo3_automation.py`: mới là service interface + stub user-authorized.
- `modules/video_analyzer.py`: transcription bằng `faster-whisper` chưa bật pipeline thật.
- Các tab:
  - text to video
  - image to video
  - idea to video
  - character sync
  - storyboard
  - thumbnail
  - create image
  - video translate

## 8) Gợi ý mở rộng tiếp theo

- Tách task chạy nền (thread/queue) để tránh block UI.
- Thêm job manager + progress per task.
- Tạo prompt templates trong `data/prompts/` theo từng ngách.
- Viết test cho modules service (config/logger/gemini).
