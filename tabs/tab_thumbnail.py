from tabs.tab_placeholders import PlaceholderTab


class TabThumbnail(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Thumbnail", "Gợi ý concept thumbnail và text overlay.")
