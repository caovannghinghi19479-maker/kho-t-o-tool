from tabs.tab_placeholders import PlaceholderTab


class TabStoryboard(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Storyboard", "Tạo storyboard từng cảnh với mô tả camera.")
