from kivymd.app import MDApp
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen


Builder.load_file("design.kv")

class RootWidget(ScreenManager):
    pass

class MainScreen(Screen):
    pass

class AutoSocial(MDApp):
    
    def build(self):
        self.theme_cls.primary_palette = "Gray"
        return RootWidget()

if __name__ == "__main__":
    AutoSocial().run()
