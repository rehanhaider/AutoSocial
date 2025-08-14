#!/bin/bash
# Get the project name from config.json file, remove spaces, and make lowercase

PROJECT_NAME=$(cat config.json | jq -r '.PROJECT_NAME' | tr -d ' ')

# Compute the MD5 hash of the project name and add project name to the end
BUCKET_NAME="$(echo -n $PROJECT_NAME | md5sum | cut -d ' ' -f 1)-$(echo $PROJECT_NAME | tr '[:upper:]' '[:lower:]')"

echo "Creating bucket $BUCKET_NAME"

# Create the bucket
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Add tags to the bucket
aws s3api put-bucket-tagging \
    --bucket "$BUCKET_NAME" \
    --tagging '{"TagSet":[{"Key":"Project","Value":'\"$PROJECT_NAME\"'}]}'
