import json
import os
import boto3
import logging
from typing import Dict, Any

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize boto3 clients
cognito_client = boto3.client("cognito-idp")
USER_POOL_ID = os.environ.get("USER_POOL_ID")


def lambda_handler(event: Dict[Any, Any], context: Any) -> Dict[str, Any]:
    """
    Main handler for auth-related operations
    """
    logger.info(f"Event received: {json.dumps(event)}")

    # Get HTTP method and path
    http_method = event.get("httpMethod", "")
    resource_path = event.get("resource", "")

    # Check for required environment variables
    if not USER_POOL_ID:
        logger.error("Required environment variable USER_POOL_ID is not set")
        return build_response(500, {"message": "Internal server error - configuration issue"})

    # Extract user information from the request
    user_id = get_user_id_from_event(event)
    if not user_id:
        logger.error("User ID could not be extracted from request")
        return build_response(401, {"message": "Unauthorized"})

    # Handle the auth GET request
    if http_method == "GET" and resource_path == "/auth":
        return get_user(user_id)

    # Default response for unhandled routes
    return build_response(400, {"message": "Bad request - invalid route"})


def get_user(user_id: str) -> Dict[str, Any]:
    """
    Get user information from Cognito
    """
    try:
        # Call Cognito to get user information
        response = cognito_client.admin_get_user(UserPoolId=USER_POOL_ID, Username=user_id)

        # Extract user attributes
        user_attributes = {}
        for attr in response.get("UserAttributes", []):
            user_attributes[attr["Name"]] = attr["Value"]

        return build_response(
            200,
            {
                "id": user_id,
                "username": response.get("Username"),
                "email": user_attributes.get("email", ""),
                "status": response.get("UserStatus"),
                "created_at": response.get("UserCreateDate", ""),
                "updated_at": response.get("UserLastModifiedDate", ""),
            },
        )

    except cognito_client.exceptions.UserNotFoundException:
        logger.error(f"User {user_id} not found")
        return build_response(404, {"message": "User not found"})
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        return build_response(500, {"message": "Error retrieving user information"})


def get_user_id_from_event(event: Dict[Any, Any]) -> str:
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


def build_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
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
        "body": json.dumps(body),
    }
