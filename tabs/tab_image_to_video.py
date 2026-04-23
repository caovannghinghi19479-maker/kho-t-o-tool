from tabs.tab_placeholders import PlaceholderTab


class TabImageToVideo(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Image → Video", "Tạo video từ ảnh nguồn với chuyển động AI.")
