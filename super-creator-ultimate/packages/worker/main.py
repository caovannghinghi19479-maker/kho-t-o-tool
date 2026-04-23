from __future__ import annotations

import os
import shutil
from typing import Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

from services.gemini_service import GeminiService
from services.media_analyzer import CompetitorAnalysisResult, MediaAnalyzer
from services.post.concat import concat_videos
from services.post.exporter import export_video
from services.post.subtitle_burner import burn_subtitles
from services.research.frame_extractor import extract_scene_keyframes
from services.research.video_analyzer import analyze_video_metrics
from services.research.whisper_transcribe import transcribe_with_words
from services.research.youtube import research_youtube

app = FastAPI(title="SuperCreator Worker", version="0.2.0")


class AnalyzeCompetitorRequest(BaseModel):
    url: HttpUrl


class GeneratePromptRequest(BaseModel):
    idea: str
    style: Optional[str] = None


class YouTubeResearchRequest(BaseModel):
    url: HttpUrl


class ExtractFramesRequest(BaseModel):
    video_path: str
    threshold: float = 22.0


class TranscribeRequest(BaseModel):
    media_path: str


class BurnSubtitlesRequest(BaseModel):
    video_path: str
    srt_path: str
    output_path: Optional[str] = None


class ConcatRequest(BaseModel):
    video_paths: list[str]
    output_path: Optional[str] = None


class ExportRequest(BaseModel):
    video_path: str
    resolution: str = "1920x1080"
    fmt: str = "mp4"
    crf: int = 20


@app.on_event("startup")
def startup_check() -> None:
    if shutil.which("ffmpeg") is None:
        raise RuntimeError("ffmpeg is required in PATH for worker startup.")


@app.get("/worker/health")
def worker_health() -> dict[str, str]:
    return {"status": "ok", "service": "worker"}


@app.post("/worker/analyze-competitor")
def analyze_competitor(payload: AnalyzeCompetitorRequest) -> dict:
    analyzer = MediaAnalyzer()
    gemini = GeminiService(api_key=os.environ.get("GEMINI_API_KEY"))

    try:
        video_path = analyzer.download_video(str(payload.url))
        frames = analyzer.extract_keyframes(video_path)
        transcript = analyzer.transcribe(video_path)
        summary = gemini.summarize_competitor(transcript, len(frames))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    result = CompetitorAnalysisResult(transcript=transcript, keyframes=frames[:10], summary=summary)
    return {"transcript": result.transcript, "keyframes": result.keyframes, "summary": result.summary}


@app.post("/worker/generate-prompt")
def generate_prompt(payload: GeneratePromptRequest) -> dict[str, str]:
    gemini = GeminiService(api_key=os.environ.get("GEMINI_API_KEY"))
    try:
        prompt = gemini.expand_prompt(payload.idea, payload.style)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return {"prompt": prompt}


@app.post("/worker/research/youtube")
def worker_research_youtube(payload: YouTubeResearchRequest) -> dict:
    try:
        result = research_youtube(str(payload.url))
        metrics = analyze_video_metrics(result.video_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "video_path": result.video_path,
        "audio_path": result.audio_path,
        "metadata": result.metadata,
        "transcript_hint": result.transcript,
        "video_metrics": metrics,
    }


@app.post("/worker/research/extract-frames")
def worker_extract_frames(payload: ExtractFramesRequest) -> dict:
    try:
        return extract_scene_keyframes(payload.video_path, payload.threshold)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/worker/research/transcribe")
def worker_transcribe(payload: TranscribeRequest) -> dict:
    try:
        return transcribe_with_words(payload.media_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/worker/post/burn-subtitles")
def worker_burn_subtitles(payload: BurnSubtitlesRequest) -> dict:
    try:
        output = burn_subtitles(payload.video_path, payload.srt_path, payload.output_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return {"output_path": output}


@app.post("/worker/post/concat")
def worker_concat(payload: ConcatRequest) -> dict:
    try:
        output = concat_videos(payload.video_paths, payload.output_path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return {"output_path": output}


@app.post("/worker/post/export")
def worker_export(payload: ExportRequest) -> dict:
    try:
        output = export_video(payload.video_path, payload.resolution, payload.fmt, payload.crf)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return {"output_path": output}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=int(os.environ.get("WORKER_PORT", "8001")), reload=False)
