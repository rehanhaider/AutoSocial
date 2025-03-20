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
SCHEDULES_TABLE = os.environ.get("SCHEDULES_TABLE")


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
    Main handler for schedule-related operations
    """
    logger.info(f"Event received: {json.dumps(event)}")

    # Get HTTP method and path
    http_method = event.get("httpMethod", "")
    resource_path = event.get("resource", "")

    # Check for required environment variables
    if not SCHEDULES_TABLE:
        logger.error("Required environment variable SCHEDULES_TABLE is not set")
        return build_response(500, {"message": "Internal server error - configuration issue"})

    # Extract user information from the request
    user_id = get_user_id_from_event(event)
    if not user_id:
        logger.error("User ID could not be extracted from request")
        return build_response(401, {"message": "Unauthorized"})

    try:
        # Route based on HTTP method and resource path
        if resource_path == "/schedules":
            if http_method == "GET":
                return get_schedules(user_id)
            elif http_method == "POST":
                body = parse_body(event)
                return create_schedule(user_id, body)

        elif resource_path == "/schedules/{id}":
            schedule_id = event.get("pathParameters", {}).get("id")
            if not schedule_id:
                return build_response(400, {"message": "Schedule ID is required"})

            if http_method == "GET":
                return get_schedule(user_id, schedule_id)
            elif http_method == "PUT":
                body = parse_body(event)
                return update_schedule(user_id, schedule_id, body)
            elif http_method == "DELETE":
                return delete_schedule(user_id, schedule_id)

        # Default response for unhandled routes
        return build_response(400, {"message": "Bad request - invalid route"})

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return build_response(500, {"message": f"Internal server error: {str(e)}"})


def get_schedules(user_id: str) -> Dict[str, Any]:
    """
    Get all schedules for a user
    """
    table = dynamodb.Table(SCHEDULES_TABLE)

    try:
        # Query schedules by user_id using the GSI
        response = table.query(
            IndexName="UserIdIndex", KeyConditionExpression=boto3.dynamodb.conditions.Key("userId").eq(user_id)
        )

        items = response.get("Items", [])

        # Format the schedules
        formatted_schedules = []
        for schedule in items:
            formatted_schedules.append(
                {
                    "id": schedule.get("id"),
                    "name": schedule.get("name"),
                    "cronExpression": schedule.get("cronExpression"),
                    "enabled": schedule.get("enabled", True),
                    "createdAt": schedule.get("createdAt"),
                    "updatedAt": schedule.get("updatedAt"),
                }
            )

        return build_response(200, formatted_schedules)

    except Exception as e:
        logger.error(f"Error retrieving schedules: {str(e)}")
        return build_response(500, {"message": "Error retrieving schedules"})


def get_schedule(user_id: str, schedule_id: str) -> Dict[str, Any]:
    """
    Get a specific schedule by ID
    """
    table = dynamodb.Table(SCHEDULES_TABLE)

    try:
        # Get schedule by ID
        response = table.get_item(Key={"id": schedule_id})

        item = response.get("Item")
        if not item:
            return build_response(404, {"message": "Schedule not found"})

        # Verify the schedule belongs to the user
        if item.get("userId") != user_id:
            return build_response(403, {"message": "Access denied"})

        # Format the schedule
        formatted_schedule = {
            "id": item.get("id"),
            "name": item.get("name"),
            "cronExpression": item.get("cronExpression"),
            "enabled": item.get("enabled", True),
            "createdAt": item.get("createdAt"),
            "updatedAt": item.get("updatedAt"),
        }

        return build_response(200, formatted_schedule)

    except Exception as e:
        logger.error(f"Error retrieving schedule: {str(e)}")
        return build_response(500, {"message": "Error retrieving schedule"})


def create_schedule(user_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new schedule
    """
    table = dynamodb.Table(SCHEDULES_TABLE)

    try:
        # Validate required fields
        name = body.get("name")
        cron_expression = body.get("cronExpression")

        if not name:
            return build_response(400, {"message": "Name is required"})

        if not cron_expression:
            return build_response(400, {"message": "Cron expression is required"})

        # Validate cron expression format (basic validation)
        if len(cron_expression.split()) != 5:
            return build_response(400, {"message": "Invalid cron expression format"})

        # Generate a unique ID for the schedule
        schedule_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        # Create the schedule
        schedule = {
            "id": schedule_id,
            "userId": user_id,
            "name": name,
            "cronExpression": cron_expression,
            "enabled": body.get("enabled", True),
            "createdAt": now,
            "updatedAt": now,
        }

        # Save to DynamoDB
        table.put_item(Item=schedule)

        return build_response(201, schedule)

    except Exception as e:
        logger.error(f"Error creating schedule: {str(e)}")
        return build_response(500, {"message": "Error creating schedule"})


def update_schedule(user_id: str, schedule_id: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update an existing schedule
    """
    table = dynamodb.Table(SCHEDULES_TABLE)

    try:
        # Check if schedule exists and belongs to user
        response = table.get_item(Key={"id": schedule_id})

        item = response.get("Item")
        if not item:
            return build_response(404, {"message": "Schedule not found"})

        if item.get("userId") != user_id:
            return build_response(403, {"message": "Access denied"})

        # Prepare update expressions
        update_expressions = []
        expression_attribute_values = {}
        expression_attribute_names = {}

        # Update name if provided
        if "name" in body:
            update_expressions.append("#name = :name")
            expression_attribute_names["#name"] = "name"
            expression_attribute_values[":name"] = body.get("name")

        # Update cronExpression if provided
        if "cronExpression" in body:
            cron_expression = body.get("cronExpression")

            # Validate cron expression format
            if len(cron_expression.split()) != 5:
                return build_response(400, {"message": "Invalid cron expression format"})

            update_expressions.append("#cronExpression = :cronExpression")
            expression_attribute_names["#cronExpression"] = "cronExpression"
            expression_attribute_values[":cronExpression"] = cron_expression

        # Update enabled if provided
        if "enabled" in body:
            update_expressions.append("#enabled = :enabled")
            expression_attribute_names["#enabled"] = "enabled"
            expression_attribute_values[":enabled"] = body.get("enabled")

        # Add updated timestamp
        now = datetime.utcnow().isoformat()
        update_expressions.append("#updatedAt = :updatedAt")
        expression_attribute_names["#updatedAt"] = "updatedAt"
        expression_attribute_values[":updatedAt"] = now

        # Perform the update if there are changes
        if update_expressions:
            update_expression = "SET " + ", ".join(update_expressions)

            table.update_item(
                Key={"id": schedule_id},
                UpdateExpression=update_expression,
                ExpressionAttributeNames=expression_attribute_names,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW",
            )

        # Fetch the updated schedule
        response = table.get_item(Key={"id": schedule_id})

        updated_item = response.get("Item", {})

        return build_response(200, updated_item)

    except Exception as e:
        logger.error(f"Error updating schedule: {str(e)}")
        return build_response(500, {"message": "Error updating schedule"})


def delete_schedule(user_id: str, schedule_id: str) -> Dict[str, Any]:
    """
    Delete a schedule
    """
    table = dynamodb.Table(SCHEDULES_TABLE)

    try:
        # Check if schedule exists and belongs to user
        response = table.get_item(Key={"id": schedule_id})

        item = response.get("Item")
        if not item:
            return build_response(404, {"message": "Schedule not found"})

        if item.get("userId") != user_id:
            return build_response(403, {"message": "Access denied"})

        # Delete the schedule from DynamoDB
        table.delete_item(Key={"id": schedule_id})

        return build_response(200, {"message": "Schedule deleted successfully"})

    except Exception as e:
        logger.error(f"Error deleting schedule: {str(e)}")
        return build_response(500, {"message": "Error deleting schedule"})


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
