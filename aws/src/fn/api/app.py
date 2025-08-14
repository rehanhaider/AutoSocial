"""
# --*-- coding: utf-8 --*--
# This module defines the REST API routes
"""

# ==================================================================================================
# Python imports
from os import environ

# ==================================================================================================
# Powertools imports
from aws_lambda_powertools.event_handler import APIGatewayRestResolver, CORSConfig
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module-level imports
from lib.token import parse_token
from shared.lambda_response import RESPONSE
from shared.logger import logger

# ==================================================================================================
# Global declarations
BUCKET_NAME = environ.get("BUCKET_NAME")
DOMAIN_NAME = environ.get("DOMAIN_NAME")


# ==================================================================================================
# Global initializations
cors_config = CORSConfig(
    allow_origin="*",
    allow_headers=["*", "Authorization"],
)

app = APIGatewayRestResolver(cors=cors_config)

# ==================================================================================================
# Routes


@app.get("/v1/home")
def home() -> dict:
    data: dict = app.current_event.json_body
    user_id = parse_token(app.current_event.headers.get("authorization"))["cognito:username"]
    logger.info(f"User ID: {user_id}")
    logger.info(f"Home data: {data}")
    return RESPONSE(body={"message": "Home page data"})


@app.get("/v1/upload")
def upload() -> dict:

    ## Create an S3 signed URL
    ## Send the S3 signed URL to the client
    ## Default tag is "SCHEDULED=False"

    return RESPONSE(body={"signedUrl": "s3://signed-url"})


@app.post("/v1/schedule")
def schedule() -> dict:
    ## Get the s3 object key from request body
    ## Schedule the job in eventbridge
    ## Add the object key, and schedule id to the database along with details of the schedule
    return RESPONSE(body={"jobId": "job-id"})


def main(event: dict, context: LambdaContext) -> dict:
    """
    The lambda handler method: It resolves the proxy route and invokes the appropriate method
    """
    return app.resolve(event, context)
