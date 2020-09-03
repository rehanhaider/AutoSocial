# Setting up the page authentication
Reference url: https://developers.facebook.com/docs/pages/access-tokens
## Get Short-lived User Access Token from Graph Explorer tool 
Use one of the following methods to get a short-lived User access token:
* The Graph Explorer tool (https://developers.facebook.com/docs/graph-api/explorer#get-token-dropdown)
* The Facebook Login Dialog in-app (https://developers.facebook.com/docs/facebook-login/)
Short-lived user access tokens are valid for only one hour
## Get long lived user access token (valid for 60 days)
To get a long-lived User access token you will first create a short-lived User access token.
Next, you will exchange the short-lived User access token for a long-lived User access token.

## Get list of pages
## Get page access token
## Get Access Tokens of Pages You Manage

# Manage Facebook Pages
ok test this 
    Reference URL: https://developers.facebook.com/docs/pages/managing
    Get a list of Pages, Tasks & Tokens
    curl -i -X GET "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret=app-secret}&fb_exchange_token={short-lived-user-access-token
# Publish Page Content
    ## Reference URL: https://developers.facebook.com/docs/pages/publishing
    ## Publish content
    ## Schedule content