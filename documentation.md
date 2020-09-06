# AutoSocial Documentation
This documenation provides a reference of implementation of an app similar to AutoSocial in any other language using HTTP methods

## Step 1: Setting up the page authentication
Reference url: https://developers.facebook.com/docs/pages/access-tokens

This section deals with getting permissions and access to be able to edit a page

### Step 1.1: Get Short-lived User Access Token from Graph Explorer tool 
Use one of the following methods to get a short-lived User access token:
* The Graph Explorer tool (https://developers.facebook.com/docs/graph-api/explorer#get-token-dropdown)
* The Facebook Login Dialog in-app (https://developers.facebook.com/docs/facebook-login/)
Short-lived user access tokens are valid for only one hour

***This document only describes the Graph Explorer tool method for now***

### Step 1.2: Get long lived user access token (valid for 60 days)
To get a long-lived User access token you will first create a short-lived User access token.
Next, you will exchange the short-lived User access token for a long-lived User access token.

#### Send a GET request to the /oauth/access_token endpoint. Replace {app-id}, {app-secret}, and {access-token} with your information.
```
curl -i -X GET "https://graph.facebook.com/{page-id}?
  fields=access_token&
  access_token={user-access-token}"
```

#### Output format
```
{
    "access_token": "{long-lived-user-access-token}",
    "token_type": "bearer",
    "expires_in": {seconds-until-token-expires}
}
```

### Step 1.3: Get Access Tokens of Pages You Manage
To get list of Pages and their corresponding Page access tokens, you will need a User access token and the ***pages_show_list*** permission.

#### Send a GET request to the /{user-id}/accounts endpoint:
```
curl -i -X GET "https://graph.facebook.com/{user-id}/accounts?
  fields=name,access_token&
  access_token={user-accesss-token}"
```

#### Output format
```
{
  "data": [
    {
      "name": "Facebook Page 1",
      "access_token": "{page-access-token-for-Page-1}",
      "id": "{page-1-id}"
    },
    {
      "name": "Facebook Page 2",
      "access_token": "{page-access-token-for-Page-2}",
      "id": "{page-2-id}"
    }
}
```

## Step 2: Managing the page
This section deals with getting page content, publishing and managing the page
Reference URL: https://developers.facebook.com/docs/pages/managing

### Step 2.1: Get a List of Pages
**Prerequisites**
* the ***pages_show_list*** permission
* a User access token to list all Pages on which you can perform the MODERATE task on the Page

#### Send a GET request to /{user-id}/accounts endpoint:
```
curl -i -X GET 
     "https://graph.facebook.com/{user-id}/accounts
     ?access_token={user-access-token}"
```

#### Output Format
```
{
  "data": [
    {
      "access_token": "{facebook-for-developers-page-access-token}",
      "category": "Internet Company",
      "category_list": [
        {
          "id": "2256",
          "name": "Internet Company"
        }
      ],
      "name": "Facebook for Developers",
      "id": "{facebook-for-developers-page-id}",
      "tasks": [
        "ANALYZE",
        "ADVERTISE",
        "MODERATE",
        "CREATE_CONTENT"
      ]
    },
    {
      "access_token": "{my-outlandish-stories-page-access-token}",
      "category": "Blogger",
      "category_list": [
        {
          "id": "361282040719868",
          "name": "Blogger"
        }
      ],
      "name": "My Outlandish Stories",
      "id": "{my-outlandish-stories-page-id}",
      "tasks": [
        "ANALYZE",
        "ADVERTISE",
        "MODERATE",
        "CREATE_CONTENT",
        "MANAGE"
      ]
    }
}
```
## Step 3: Page Content
Reference URL: https://developers.facebook.com/docs/pages/publishing

### Step 3.1: Publish a Photo
Reference URL: https://developers.facebook.com/docs/graph-api/reference/photo

**Prerequisite**
* The ***pages_manage_posts*** permission
* The ***pages_read_engagement*** permission
* A Page access token requested by a person who is able to perform the CREATE_CONTENT task on the Page that is being queried

There are two ways to upload photos to Facebook:
* Attach the photo as multipart/form-data. The name of the object doesn't matter, but historically people have used source as the parameter name for the photo. How this works depends on the SDK you happen to be using to do the post.
* Use a photo that is already on the internet by publishing using the url parameter:

Regerence URL: https://developers.facebook.com/docs/graph-api/reference/v2.1/page/photos

#### Send a POST request to the /{page-id}/feed endpoint:
```
curl -i -X "POST https://graph.facebook.com/{page-id}/photos
    ?url={path-to-photo}
    &access_token={page-access-token}"
```

#### Output Format
```
{
  "id":"{photo-id}",                        
  "post_id":"{page-post-id}"    
}
```
### Step 3.2: Schedule a photo
**Prerequisite**
* The ***pages_manage_posts*** permission
* The ***pages_read_engagement*** permission
* A Page access token requested by a person who is able to perform the CREATE_CONTENT task on the Page that is being queried

Send a POST request to the /{page-id}/feed endpoint with the published parameter set to false and the scheduled_publish_time parameter set to the timestamp in any of the following formats:
* An integer UNIX timestamp [in seconds] (e.g. 1530432000)
* An ISO 8061 timestamp string (e.g. 2018-09-01T10:15:30+01:00)
* Any string otherwise parsable by PHP's strtotime() (e.g. +2 weeks, tomorrow)

Note, if you are relying on strtotime()'s relative date strings you can read-after-write the scheduled_publish_time of the created post to make sure it is what is expected.

#### Send a GET request with photo identifier
```
curl -i -X POST "https://graph.facebook.com/{page-id}/photos
  ?published=false
  &url={path-to-photo}
  &scheduled_publish_time={unix-time-stamp-of-a-future-date}
  &access_token={page-access-token}"
```

#### Output Format
```
{
  "id": "{page-post-id}"   
}
```