import requests
import json


def getLongLivedUserAccessToken(app_id, app_secret, short_lived_user_access_token):
    token = requests.get(
        f"https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_user_access_token}"
    )
    return token


def getListOfPages(user_id, user_access_token):
    pages = requests.get(
        f"https://graph.facebook.com/{user_id}/accounts?access_token={user_access_token}"
    )
    return pages


def getPageAccessToken(page_id, user_access_token):
    '''
    If you used a short-lived User access token, the Page access token is valid for only 1 hour.
    If you used a long-lived User access token, the Page access token has no expiration date.
    '''
    pageToken = requests.get(
        f"https://graph.facebook.com/{page_id}?fields=access_token&access_token={user_access_token}"
    )
    return pageToken