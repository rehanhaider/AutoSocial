import requests
import json


def getShortLivedUserAccessToken():
    return "EAAJghWvjIX8BAAnowdUwMaTZCEa6xlXuU1QpxJLMBg29NGR452TrsWEdqV7iDVdAOFo4h2OZBRYGLtJDp0FZCnirm2DucvRp0nSnEoYhl6iuCAxpr6yz7NQ54ePeiDr8ZCq8HGrUndvMbGmTZC4SXzVq1WngsZBCEuV8c5dY0BwXraTYky7dFBeY8NvRfNKeLfqt0sZCGBbKwZDZD"


def getLongLivedUserAccessToken(app_id, app_secret, short_lived_user_access_token):
    token = requests.get(
        f"https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_user_access_token}"
    )
    return str(token.content,"utf-8")

def getUserID(user_access_token):
    user = requests.get(f"https://graph.facebook.com/v8.0/me?fields=id%2Cname&access_token={user_access_token}")
    return str(user.content,"utf-8")

def getManagedPageAccessDetails(user_id, user_access_token):
    """
    If you used a short-lived User access token, the Page access token is valid for only 1 hour.
    If you used a long-lived User access token, the Page access token has no expiration date.
    """
    pageDetails = requests.get(
        f"https://graph.facebook.com/{user_id}/accounts?fields=name,access_token&access_token={user_access_token}"
    )    
    return str(pageDetails.content,"utf-8")

def publishPhotoByURL(page_id, url_to_photo, page_access_token):
    photo_post = requests.post(
        f"https://graph.facebook.com/{page_id}/photos?url={url_to_photo}&access_token={page_access_token}"
    )
    return str(photo_post.content,"utf-8")

def publishPhotoByFile(page_id, path_to_photo, page_access_token):
    files = {"source": open(path_to_photo, "rb")}
    photo_post = requests.post(f"https://graph.facebook.com/{page_id}/photos?access_token={page_access_token}", files=files)

    return str(photo_post.content,"utf-8")

def schedulePhoto(page_id, path_to_photo, scheduled_time, page_access_token):
    photo_schedule = requests.post(
        f"https://graph.facebook.com/{page_id}/photos?published=false&url={path_to_photo}&scheduled_publish_time={scheduled_time}&access_token={page_access_token}"
    )
    return str(photo_schedule.content,"utf-8")