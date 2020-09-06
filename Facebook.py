from configparser import ConfigParser
import GraphAPI
from datetime import datetime
import json
import requests

class Facebook():
    
    def __init__(self):
        self.config = ConfigParser()
        self.configFile = "Facebook.ini"
        self.config.read(self.configFile)
        self.appID = self.config["DEFAULT"]["app_id"]
        self.appSecret = self.config["DEFAULT"]["app_secret"]
    
    def getShortLivedUserAccessToken(self):
        if self.config["DEFAULT"]["first_run"] == "Yes":
            self.config["ShortUserAccessToken"] = {"token": GraphAPI.getShortLivedUserAccessToken()}
            self.config["DEFAULT"]["first_run"] = "No"
            with open(self.configFile,"w") as cf:
                self.config.write(cf)
        self.shortUserAccessToken = self.config["ShortUserAccessToken"]["Token"]

    def getNewLongUserToken(self):
        try:
            self.longUserRequest = GraphAPI.getLongLivedUserAccessToken(self.appID, self.appSecret, self.shortUserAccessToken)
            self.config["LongUserAccessToken"] = self.longUserRequest
            self.config["LongUserAccessToken"]["time_obtained"] = str(datetime.utcnow().timestamp())
            with open(self.configFile,"w") as cf:
                self.config.write(cf)
            return self.config["LongUserAccessToken"]["access_token"]
        except KeyError as error:
            if str(error).strip("'") == "access_token":
                self.getShortLivedUserAccessToken()

    def getLongLivedUserAccessToken(self):
        try:
            self.longUserAccessToken = self.config["LongUserAccessToken"]["access_token"]
        except KeyError as error:
            if str(error).strip("'") == "LongUserAccessToken":
                self.longUserAccessToken = self.getNewLongUserToken()
        finally:
            timeObtained = float(self.config["LongUserAccessToken"]["time_obtained"])
            timeLeft = float(self.config["LongUserAccessToken"]["expires_in"])
            if timeObtained + timeLeft < datetime.utcnow().timestamp():
                self.longUserAccessToken = self.getNewLongToken()

    def getUserDetails(self):
        self.config["UserDetails"] = GraphAPI.getUserID(self.longUserAccessToken)
        with open(self.configFile,"w") as cf:
            self.config.write(cf)

    def getManagedPageDetails(self):
        userID = self.config["UserDetails"]["id"]
        userDetails = GraphAPI.getManagedPageAccessDetails(userID, self.config["LongUserAccessToken"]["access_token"])
        return userDetails
    
    def postPhototoPage(self, page_id,path_to_photo,page_access_token):
        post = GraphAPI.publishPhotoByFile(page_id, path_to_photo, page_access_token)
        return post
        
fb = Facebook()
#fb.getLongLivedUserAccessToken()
r = eval(fb.getManagedPageDetails())

page_id = "252026078205907"
pageTK = "EAAJghWvjIX8BAD6wp8GNGoRTgs8Kwd7RLL4aKKTJvLIUQr3cciKxsY5tBJ8jVhvFqxFR8sV1ZAN9QvPbWwRKZCCdOfwBPp1OEyFxFVZAY6lZAo7bXnZBosDw2ecgsZAZBFlW1aNfZCNlVsnOxVLCcq17WlYoXYzuKlBc75xxwazduQZDZD"

print(r["data"][0])