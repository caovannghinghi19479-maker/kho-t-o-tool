def make_scene_prompts(concept: str, scene_count: int):
    return [{"index": i + 1, "veo3Prompt": f"{concept} - cinematic scene {i + 1}"} for i in range(scene_count)]
