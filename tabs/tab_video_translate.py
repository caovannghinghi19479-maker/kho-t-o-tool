from tabs.tab_placeholders import PlaceholderTab


class TabVideoTranslate(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Video Translate", "Dịch subtitle/lời thoại sang ngôn ngữ khác.")
