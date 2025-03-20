import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as path from "path";

interface ApiStackProps extends cdk.StackProps {
    userPool: cognito.UserPool;
    postsTable: dynamodb.Table;
    schedulesTable: dynamodb.Table;
    mediaBucket: s3.Bucket;
}

export class ApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        // Create the API Gateway
        const api = new apigateway.RestApi(this, "AutoSocialApi", {
            description: "Auto Social API Gateway",
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
                allowCredentials: true,
            },
        });

        // Authorizer using Cognito User Pool
        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, "AutoSocialAuthorizer", {
            cognitoUserPools: [props.userPool],
        });

        // Common Lambda environment variables
        const commonEnvironment = {
            POSTS_TABLE: props.postsTable.tableName,
            SCHEDULES_TABLE: props.schedulesTable.tableName,
            MEDIA_BUCKET: props.mediaBucket.bucketName,
            USER_POOL_ID: props.userPool.userPoolId,
        };

        // Lambda function basic execution role with additional permissions
        const lambdaExecutionRole = new iam.Role(this, "LambdaExecutionRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")],
        });

        // Grant permissions to access resources
        props.postsTable.grantReadWriteData(lambdaExecutionRole);
        props.schedulesTable.grantReadWriteData(lambdaExecutionRole);
        props.mediaBucket.grantReadWrite(lambdaExecutionRole);

        // Grant Cognito admin permissions to the role
        lambdaExecutionRole.addToPolicy(
            new iam.PolicyStatement({
                actions: ["cognito-idp:AdminGetUser", "cognito-idp:AdminUpdateUserAttributes"],
                resources: [props.userPool.userPoolArn],
            })
        );

        // Create Lambda functions

        // Auth Lambda function
        const authLambda = new lambda.Function(this, "AuthFunction", {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "handler.lambda_handler",
            code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/auth")),
            environment: commonEnvironment,
            role: lambdaExecutionRole,
        });

        // Posts Lambda function
        const postsLambda = new lambda.Function(this, "PostsFunction", {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "handler.lambda_handler",
            code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/posts")),
            environment: commonEnvironment,
            role: lambdaExecutionRole,
            timeout: cdk.Duration.seconds(30),
        });

        // Schedules Lambda function
        const schedulesLambda = new lambda.Function(this, "SchedulesFunction", {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "handler.lambda_handler",
            code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/schedules")),
            environment: commonEnvironment,
            role: lambdaExecutionRole,
        });

        // Add resources and methods to API Gateway

        // Auth Resource
        const authResource = api.root.addResource("auth");
        authResource.addMethod("GET", new apigateway.LambdaIntegration(authLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });

        // Posts Resource
        const postsResource = api.root.addResource("posts");
        postsResource.addMethod("GET", new apigateway.LambdaIntegration(postsLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });
        postsResource.addMethod("POST", new apigateway.LambdaIntegration(postsLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });

        const postResource = postsResource.addResource("{id}");
        postResource.addMethod("GET", new apigateway.LambdaIntegration(postsLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });
        postResource.addMethod("PUT", new apigateway.LambdaIntegration(postsLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });
        postResource.addMethod("DELETE", new apigateway.LambdaIntegration(postsLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });

        // Schedules Resource
        const schedulesResource = api.root.addResource("schedules");
        schedulesResource.addMethod("GET", new apigateway.LambdaIntegration(schedulesLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });
        schedulesResource.addMethod("POST", new apigateway.LambdaIntegration(schedulesLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });

        const scheduleResource = schedulesResource.addResource("{id}");
        scheduleResource.addMethod("GET", new apigateway.LambdaIntegration(schedulesLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });
        scheduleResource.addMethod("PUT", new apigateway.LambdaIntegration(schedulesLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });
        scheduleResource.addMethod("DELETE", new apigateway.LambdaIntegration(schedulesLambda), {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        });

        // Outputs
        new cdk.CfnOutput(this, "ApiUrl", {
            value: api.url,
            exportName: "AutoSocialApiUrl",
        });
    }
}
