from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager, Screen
import json
import glob
import random
from pathlib import Path

Builder.load_file("design.kv")


class MainScreen(Screen):
    pass


class RootWidget(ScreenManager):
    pass


class AutoSocial(App):
    def build(self):
        return RootWidget()



AutoSocial().run()