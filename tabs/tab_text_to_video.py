from tabs.tab_placeholders import PlaceholderTab


class TabTextToVideo(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Text → Video", "Sinh video từ văn bản bằng prompt tùy biến.")
