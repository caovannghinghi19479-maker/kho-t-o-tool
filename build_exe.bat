@echo off
setlocal

echo =====================================
echo Build AutoVeo3Ultimate (Windows EXE)
echo =====================================

if not exist .venv (
    echo [INFO] Tao virtual environment...
    py -3.11 -m venv .venv
)

call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Can thiet cho Playwright neu dung automation browser
python -m playwright install chromium

pyinstaller ^
  --noconfirm ^
  --windowed ^
  --name AutoVeo3Ultimate ^
  --add-data "data;data" ^
  --add-data "assets;assets" ^
  main.py

echo.
echo Build xong. Kiem tra thu muc dist\AutoVeo3Ultimate\
pause
