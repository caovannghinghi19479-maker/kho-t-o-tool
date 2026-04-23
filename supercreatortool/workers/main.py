from __future__ import annotations
from fastapi import FastAPI
from pydantic import BaseModel
from yt_dlp import YoutubeDL
from pathlib import Path
from services.ffmpeg_service import extract_audio
from services.whisper_service import transcribe
from services.keyframe_service import extract_keyframes
from services.competitor_analysis import summarize

app = FastAPI(title="SuperCreatorTool Worker")
workspace = Path(__file__).resolve().parent / ".worker_data"
workspace.mkdir(exist_ok=True)

class DownloadIn(BaseModel):
    url: str

class VideoPathIn(BaseModel):
    videoPath: str

class AudioIn(BaseModel):
    audioPath: str
    language: str = "auto"
    modelSize: str = "base"

class KeyframeIn(BaseModel):
    videoPath: str
    fps: int = 1

class AnalyzeIn(BaseModel):
    videoPath: str
    transcript: str
    metadata: dict


def ok(data):
    return {"success": True, "data": data}


def fail(err: Exception):
    return {"success": False, "error": str(err)}

@app.get("/worker/health")
def health():
    return ok({"status": "ok"})

@app.post("/worker/download-video")
def download_video(payload: DownloadIn):
    try:
      ydl_opts = {"outtmpl": str(workspace / "%(title)s.%(ext)s"), "quiet": True, "noplaylist": True}
      with YoutubeDL(ydl_opts) as ydl:
          info = ydl.extract_info(payload.url, download=True)
          path = ydl.prepare_filename(info)
      return ok({"localPath": path, "metadata": {"title": info.get("title"), "duration": info.get("duration"), "channel": info.get("channel")}})
    except Exception as e:
      return fail(e)

@app.post("/worker/extract-audio")
def extract_audio_route(payload: VideoPathIn):
    try:
        return ok({"audioPath": extract_audio(payload.videoPath)})
    except Exception as e:
        return fail(e)

@app.post("/worker/transcribe")
def transcribe_route(payload: AudioIn):
    try:
        text, segments = transcribe(payload.audioPath, payload.language, payload.modelSize)
        return ok({"transcript": text, "segments": segments})
    except Exception as e:
        return fail(e)

@app.post("/worker/extract-keyframes")
def keyframes_route(payload: KeyframeIn):
    try:
        frame_dir, frames = extract_keyframes(payload.videoPath, payload.fps)
        return ok({"frameDir": frame_dir, "frameCount": len(frames), "frames": frames})
    except Exception as e:
        return fail(e)

@app.post("/worker/analyze-competitor")
def analyze_route(payload: AnalyzeIn):
    try:
        return ok(summarize(payload.transcript))
    except Exception as e:
        return fail(e)
