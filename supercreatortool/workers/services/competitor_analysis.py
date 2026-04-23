def summarize(transcript: str):
    lines = [l.strip() for l in transcript.split(".") if l.strip()]
    return {
        "hook": lines[0] if lines else "Unknown hook",
        "pacing": "medium: balanced cuts and dialogue",
        "structure": lines[:8],
        "visualMotifs": ["talking head", "b-roll", "text overlays"],
        "weakPoints": ["repetitive middle section", "weak CTA"],
        "duration": max(len(transcript.split()) / 2.3, 1)
    }
