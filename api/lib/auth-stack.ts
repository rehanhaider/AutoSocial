import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

interface AuthStackProps extends cdk.StackProps {
    userPoolName: string;
    userPoolClientName: string;
}

export class AuthStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props: AuthStackProps) {
        super(scope, id, props);

        // Create Cognito User Pool
        this.userPool = new cognito.UserPool(this, "UserPool", {
            userPoolName: props.userPoolName,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                username: true,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: false,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // not for production
        });

        // Create User Pool Client
        this.userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
            userPool: this.userPool,
            userPoolClientName: props.userPoolClientName,
            authFlows: {
                userPassword: true,
                userSrp: true,
                adminUserPassword: true,
                custom: true,
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                    implicitCodeGrant: true,
                },
                scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE, cognito.OAuthScope.OPENID],
                callbackUrls: [
                    "exp://127.0.0.1:19000/--/", // For Expo development
                    "https://localhost/", // For local testing
                    "autosocial://callback", // For the mobile app
                ],
                logoutUrls: ["exp://127.0.0.1:19000/--/", "https://localhost/", "autosocial://signout"],
            },
            preventUserExistenceErrors: true,
        });

        // Create Identity Pool
        const identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
            identityPoolName: "AutoSocialIdentityPool",
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: this.userPoolClient.userPoolClientId,
                    providerName: this.userPool.userPoolProviderName,
                },
            ],
        });

        // Outputs
        new cdk.CfnOutput(this, "UserPoolId", {
            value: this.userPool.userPoolId,
            exportName: "AutoSocialUserPoolId",
        });

        new cdk.CfnOutput(this, "UserPoolClientId", {
            value: this.userPoolClient.userPoolClientId,
            exportName: "AutoSocialUserPoolClientId",
        });

        new cdk.CfnOutput(this, "IdentityPoolId", {
            value: identityPool.ref,
            exportName: "AutoSocialIdentityPoolId",
        });
    }
}
