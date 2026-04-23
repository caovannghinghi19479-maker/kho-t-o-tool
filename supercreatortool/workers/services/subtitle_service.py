def segments_to_srt(segments):
    rows = []
    for i, seg in enumerate(segments, 1):
        rows.append(f"{i}\n{seg['start']:.2f} --> {seg['end']:.2f}\n{seg['text']}\n")
    return "\n".join(rows)
