#import facebook
import requests
import json
from configparser import ConfigParser

def config_section_map(_section):
    dict1 = {}
    options = config.options(_section)
    for option in options:
        try:
            dict1[option] = config.get(_section, option)
            if dict1[option] == -1:
                print("skip: %s" % option)
        except:
            print("exception on %s!" % option)
            dict1[option] = None
    return dict1

config_file = "config.ini"

config = ConfigParser()

config.read(config_file)

sections = config.sections()
print(sections)
access_token = config_section_map('ACCESS_TOKEN')['access_token']
print(access_token)

