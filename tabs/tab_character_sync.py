from tabs.tab_placeholders import PlaceholderTab


class TabCharacterSync(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Character Sync", "Đồng bộ nhân vật qua nhiều cảnh/video.")
