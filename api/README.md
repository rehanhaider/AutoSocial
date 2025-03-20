# AutoSocial Backend API

This is the backend API for the AutoSocial Twitter post scheduler app. It's built using AWS CDK with TypeScript for infrastructure and Python for Lambda functions.

## Architecture

The backend consists of three main stacks:

1. **Storage Stack**: DynamoDB tables for posts and schedules, and an S3 bucket for media storage.
2. **Auth Stack**: Cognito User Pool and Client for authentication and authorization.
3. **API Stack**: API Gateway with Lambda integrations for handling requests.

## Prerequisites

-   Node.js (v16 or later)
-   npm (v8 or later)
-   AWS CLI configured with appropriate credentials
-   Python 3.12
-   AWS CDK CLI

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Configure environment variables:

    ```bash
    cp .env.example .env
    # Edit .env file with your AWS account ID and preferred settings
    ```

3. Install Python dependencies for Lambda functions:

    ```bash
    pip install -r lambda/requirements.txt
    ```

4. Bootstrap AWS CDK (if not already done):
    ```bash
    cdk bootstrap
    ```

## Deployment

To deploy the API to AWS:

```bash
npm run deploy
```

This will deploy all three stacks (Storage, Auth, and API) to your AWS account.

To deploy a specific stack:

```bash
cdk deploy AutoSocialStorageStack
```

## Lambda Functions

The API includes Lambda functions for:

1. **Auth**: User management and authentication
2. **Posts**: Create, read, update, and delete posts
3. **Schedules**: Create, read, update, and delete posting schedules

## API Endpoints

### Auth

-   `GET /auth` - Get current user info

### Posts

-   `GET /posts` - List all posts for a user
-   `POST /posts` - Create a new post
-   `GET /posts/{id}` - Get a specific post
-   `PUT /posts/{id}` - Update a post
-   `DELETE /posts/{id}` - Delete a post

### Schedules

-   `GET /schedules` - List all schedules for a user
-   `POST /schedules` - Create a new schedule
-   `GET /schedules/{id}` - Get a specific schedule
-   `PUT /schedules/{id}` - Update a schedule
-   `DELETE /schedules/{id}` - Delete a schedule

## Development

To watch for changes and automatically redeploy:

```bash
cdk watch
```

## Testing

Testing utilities can be added as needed for unit and integration tests.

## Clean up

To destroy all deployed resources:

```bash
cdk destroy --all
```

## Security Considerations

-   This template includes basic security features like authorization and validation
-   For production, enhance with additional security measures:
    -   WAF configuration
    -   Rate limiting
    -   Custom domains with proper HTTPS
    -   More restrictive CORS settings
