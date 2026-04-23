from __future__ import annotations

import google.generativeai as genai


class GeminiService:
    def __init__(self, api_key: str | None) -> None:
        if not api_key:
            self.enabled = False
            self.model = None
            return
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.enabled = True

    def expand_prompt(self, idea: str, style: str | None = None) -> str:
        if not self.enabled:
            return f"Prompt expansion unavailable (missing GEMINI_API_KEY). Base idea: {idea}"

        style_line = f"Desired visual style: {style}." if style else ""
        prompt = (
            "You are a creative video prompt engineer. Expand the user's idea into a detailed production-ready prompt"
            " with camera direction, lighting, environment, movement, and constraints."
            f"\nIdea: {idea}\n{style_line}"
        )
        response = self.model.generate_content(prompt)
        return response.text or "Gemini returned an empty prompt."

    def summarize_competitor(self, transcript: str, frame_count: int) -> str:
        if not self.enabled:
            return "Gemini summary unavailable (missing GEMINI_API_KEY)."

        prompt = (
            "Summarize this competitor content for creative direction."
            " Identify hook style, pacing, CTA strategy, and visual motifs."
            f"\nFrame count: {frame_count}\nTranscript:\n{transcript[:8000]}"
        )
        response = self.model.generate_content(prompt)
        return response.text or "Gemini returned an empty summary."
