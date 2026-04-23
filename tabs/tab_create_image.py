from tabs.tab_placeholders import PlaceholderTab


class TabCreateImage(PlaceholderTab):
    def __init__(self, master, app_context):
        super().__init__(master, app_context, "Create Image", "Sinh ảnh keyframe/reference cho pipeline video.")
