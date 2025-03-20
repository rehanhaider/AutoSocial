import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Extract user information from the Cognito authorizer
        const cognitoAuthenticationProvider = event.requestContext.identity?.cognitoAuthenticationProvider;

        if (!cognitoAuthenticationProvider) {
            return {
                statusCode: 401,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        }

        // Extract the Cognito user ID from the authentication provider string
        const parts = cognitoAuthenticationProvider.split(":");
        const userPoolUserId = parts[parts.length - 1];

        // Get user details from Cognito
        const command = new AdminGetUserCommand({
            UserPoolId: process.env.USER_POOL_ID,
            Username: userPoolUserId,
        });

        const response = await client.send(command);

        // Extract user attributes
        const userAttributes =
            response.UserAttributes?.reduce((acc, attr) => {
                if (attr.Name && attr.Value) {
                    acc[attr.Name] = attr.Value;
                }
                return acc;
            }, {} as Record<string, string>) || {};

        // Return user information
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                id: userPoolUserId,
                username: response.Username,
                email: userAttributes.email,
                attributes: userAttributes,
            }),
        };
    } catch (error) {
        console.error("Error getting user:", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            }),
        };
    }
};
