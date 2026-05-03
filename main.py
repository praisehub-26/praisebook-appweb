import webview
import os
import sys

def get_resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

if __name__ == '__main__':
    html_file = get_resource_path('index.html')
    window = webview.create_window('PraiseBook Pro', url=html_file, width=1280, height=800, background_color='#000000')
    webview.start(private_mode=False)