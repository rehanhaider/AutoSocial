import facebook
import requests
import json
from configparser import ConfigParser
import GraphAPI

access_token = ""
user_id = "10221436587876643"


token = GraphAPI.getListOfPages(user_id, access_token)
print()