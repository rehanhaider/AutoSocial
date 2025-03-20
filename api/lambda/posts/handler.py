import json
import os
import boto3
import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from decimal import Decimal

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize boto3 clients and resources
dynamodb = boto3.resource("dynamodb")
s3_client = boto3.client("s3")
POSTS_TABLE = os.environ.get("POSTS_TABLE")
MEDIA_BUCKET = os.environ.get("MEDIA_BUCKET")


# Custom JSON encoder for DynamoDB decimal values
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super(DecimalEncoder, self).default(obj)


def lambda_handler(event: Dict[Any, Any], context: Any) -> Dict[str, Any]:
    """
    Main handler for post-related operations
    """
    logger.info(f"Event received: {json.dumps(event)}")

    # Get HTTP method and path
    http_method = event.get("httpMethod", "")
    resource_path = event.get("resource", "")

    # Check for required environment variables
    if not POSTS_TABLE or not MEDIA_BUCKET:
        logger.error("Required environment variables are not set")
        return build_response(500, {"message": "Internal server error - configuration issue"})

    # Extract user information from the request
    user_id = get_user_id_from_event(event)
    if not user_id:
        logger.error("User ID could not be extracted from request")
        return build_response(401, {"message": "Unauthorized"})

    try:
        # Route based on HTTP method and resource path
        if resource_path == "/posts":
            if http_method == "GET":
                return get_posts(user_id)
            elif http_method == "POST":
                body = parse_body(event)
                return create_post(user_id, body)

        elif resource_path == "/posts/{id}":
            post_id = event.get("pathParameters", {}).get("id")
            if not post_id:
                return build_response(400, {"message": "Post ID is required"})

            if http_method == "GET":
                return get_post(user_id, post_id)
            elif http_method == "PUT":
                body = parse_body(event)
                return update_post(user_id, post_id, body)
            elif http_method == "DELETE":
                return delete_post(user_id, post_id)

        # Default response for unhandled routes
        return build_response(400, {"message": "Bad request - invalid route"})

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return build_response(500, {"message": f"Internal server error: {str(e)}"})


def get_posts(user_id: str) -> Dict[str, Any]:
    """
    Get all posts for a user
    """
    table = dynamodb.Table(POSTS_TABLE)

    try:
        # Query posts by user_id using the GSI
        response = table.query(
            IndexName="UserIdIndex", KeyConditionExpression=boto3.dynamodb.conditions.Key("userId").eq(user_id)
        )

        items = response.get("Items", [])

        # Format the posts
        formatted_posts = []
        for post in items:
            formatted_posts.append(
                {
                    "id": post.get("id"),
                    "content": post.get("content"),
                    "mediaUrl": post.get("mediaUrl"),
                    "scheduledFor": post.get("scheduledFor"),
                    "status": post.get("status"),
                    "createdAt": post.get("createdAt"),
                    "updatedAt": post.get("updatedAt"),
                }
            )

        return build_response(200, formatted_posts)

    except Exception as e:
        logger.error(f"Error retrieving posts: {str(e)}")
        return build_response(500, {"message": "Error retrieving posts"})


def get_post(user_id: str, post_id: str) -> Dict[str, Any]:
    """
    Get a specific post by ID
    """
    table = dynamodb.Table(POSTS_TABLE)

    try:
        # Get post by ID
        response = table.get_item(Key={"id": post_id})

        item = response.get("Item")
        if not item:
            return build_response(404, {"message": "Post not found"})

        # Verify the post belongs to the user
        if item.get("userId") != user_id:
            return build_response(403, {"message": "Access denied"})

        # Format the post
        formatted_post = {
            "id": item.get("id"),
            "content": item.get("content"),
            "mediaUrl": item.get("mediaUrl"),
            "scheduledFor": item.get("scheduledFor"),
            "status": item.get("status"),
            "createdAt": item.get("createdAt"),
            "updatedAt": item.get("updatedAt"),
        }

        return build_response(200, formatted_post)

    except Exception as e:
        logger.error(f"Error retrieving post: {str(e)}")
        return build_response(500, {"message": "Error retrieving post"})


def create_post(user_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new post
    """
    table = dynamodb.Table(POSTS_TABLE)

    try:
        # Validate required fields
        content = body.get("content")
        if not content:
            return build_response(400, {"message": "Content is required"})

        # Generate a unique ID for the post
        post_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        # Extract media URL if provided
        media_url = body.get("mediaUrl")

        # Extract scheduled time if provided
        scheduled_for = body.get("scheduledFor")

        # Create the post
        post = {
            "id": post_id,
            "userId": user_id,
            "content": content,
            "status": "SCHEDULED" if scheduled_for else "DRAFT",
            "createdAt": now,
            "updatedAt": now,
        }

        if media_url:
            post["mediaUrl"] = media_url

        if scheduled_for:
            post["scheduledFor"] = scheduled_for

        # Save to DynamoDB
        table.put_item(Item=post)

        return build_response(201, post)

    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        return build_response(500, {"message": "Error creating post"})


def update_post(user_id: str, post_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update an existing post
    """
    table = dynamodb.Table(POSTS_TABLE)

    try:
        # Check if post exists and belongs to user
        response = table.get_item(Key={"id": post_id})

        item = response.get("Item")
        if not item:
            return build_response(404, {"message": "Post not found"})

        if item.get("userId") != user_id:
            return build_response(403, {"message": "Access denied"})

        # Prepare update expressions
        update_expressions = []
        expression_attribute_values = {}
        expression_attribute_names = {}

        # Update content if provided
        if "content" in body:
            update_expressions.append("#content = :content")
            expression_attribute_names["#content"] = "content"
            expression_attribute_values[":content"] = body.get("content")

        # Update mediaUrl if provided
        if "mediaUrl" in body:
            update_expressions.append("#mediaUrl = :mediaUrl")
            expression_attribute_names["#mediaUrl"] = "mediaUrl"
            expression_attribute_values[":mediaUrl"] = body.get("mediaUrl")

        # Update scheduledFor if provided
        if "scheduledFor" in body:
            update_expressions.append("#scheduledFor = :scheduledFor")
            expression_attribute_names["#scheduledFor"] = "scheduledFor"
            expression_attribute_values[":scheduledFor"] = body.get("scheduledFor")

        # Update status if provided
        if "status" in body:
            update_expressions.append("#status = :status")
            expression_attribute_names["#status"] = "status"
            expression_attribute_values[":status"] = body.get("status")

        # Add updated timestamp
        now = datetime.utcnow().isoformat()
        update_expressions.append("#updatedAt = :updatedAt")
        expression_attribute_names["#updatedAt"] = "updatedAt"
        expression_attribute_values[":updatedAt"] = now

        # Perform the update if there are changes
        if update_expressions:
            update_expression = "SET " + ", ".join(update_expressions)

            table.update_item(
                Key={"id": post_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW",
            )

        # Fetch the updated post
        response = table.get_item(Key={"id": post_id})

        updated_item = response.get("Item", {})

        return build_response(200, updated_item)

    except Exception as e:
        logger.error(f"Error updating post: {str(e)}")
        return build_response(500, {"message": "Error updating post"})


def delete_post(user_id: str, post_id: str) -> Dict[str, Any]:
    """
    Delete a post
    """
    table = dynamodb.Table(POSTS_TABLE)

    try:
        # Check if post exists and belongs to user
        response = table.get_item(Key={"id": post_id})

        item = response.get("Item")
        if not item:
            return build_response(404, {"message": "Post not found"})

        if item.get("userId") != user_id:
            return build_response(403, {"message": "Access denied"})

        # Delete any associated media if it exists
        media_url = item.get("mediaUrl")
        if media_url and media_url.startswith(f"s3://{MEDIA_BUCKET}/"):
            # Extract the key from the S3 URL
            key = media_url.replace(f"s3://{MEDIA_BUCKET}/", "")
            try:
                s3_client.delete_object(Bucket=MEDIA_BUCKET, Key=key)
            except Exception as e:
                logger.warning(f"Error deleting media object: {str(e)}")

        # Delete the post from DynamoDB
        table.delete_item(Key={"id": post_id})

        return build_response(200, {"message": "Post deleted successfully"})

    except Exception as e:
        logger.error(f"Error deleting post: {str(e)}")
        return build_response(500, {"message": "Error deleting post"})


def get_user_id_from_event(event: Dict[Any, Any]) -> Optional[str]:
    """
    Extract the user ID from the event
    This assumes the user ID is in the authorizer context from Cognito
    """
    try:
        # Extract from API Gateway authorizer context
        if "requestContext" in event and "authorizer" in event["requestContext"]:
            claims = event["requestContext"]["authorizer"].get("claims", {})

            # Try different possible claim keys for user ID
            for key in ["sub", "cognito:username", "username"]:
                if key in claims:
                    return claims[key]

        return None
    except Exception as e:
        logger.error(f"Error extracting user ID: {str(e)}")
        return None


def parse_body(event: Dict[Any, Any]) -> Dict[str, Any]:
    """
    Parse the request body from the event
    """
    body = event.get("body", "{}")
    if isinstance(body, str):
        try:
            return json.loads(body)
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            return {}
    return body


def build_response(status_code: int, body: Any) -> Dict[str, Any]:
    """
    Build a standardized API Gateway response
    """
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        "body": json.dumps(body, cls=DecimalEncoder),
    }
