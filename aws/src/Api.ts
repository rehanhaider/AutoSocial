import {
    aws_apigateway as apigateway,
    aws_cognito as cognito,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda,
    aws_logs as logs,
    RemovalPolicy,
    Size,
    aws_ssm as ssm,
    Stack,
    StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface ApiStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export interface ApiStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SSM parameters
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Cognito User Pool
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const userPool = new cognito.UserPool(this, `${props.constants.APP_NAME}-UserPool`, {
            userPoolName: `${props.constants.APP_NAME}-UserPool`,
            signInAliases: { email: true },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: false,
                },
                givenName: {
                    required: true,
                    mutable: true,
                },
                familyName: {
                    required: true,
                    mutable: true,
                },
            },
            mfa: cognito.Mfa.OFF,
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            selfSignUpEnabled: true,
            autoVerify: { email: true },
            email: cognito.UserPoolEmail.withCognito(),
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const userPoolClient = new cognito.UserPoolClient(this, `${props.constants.APP_NAME}-AppClient`, {
            userPool: userPool,
            userPoolClientName: `${props.constants.APP_NAME}-AppClient`,
            generateSecret: false, // Auth handled at client side. For secure app, we need to enable this so that we can authenticate in server
            authFlows: {
                userSrp: true, // Includes refresh tokens. No need to define explicitly
                userPassword: true,
                custom: true, // In case we need to add any auth challenge for secure app
            },
        });

        // Customer domain not configured as it requries setting up a separate subdomain and associated pages. Rather using link & redirect URLs
        userPool.addDomain(`${props.constants.APP_NAME}-UserPoolDomain`, {
            cognitoDomain: {
                domainPrefix: userPoolClient.userPoolClientId,
            },
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // DynamoDB table
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const table = dynamodb.Table.fromTableAttributes(this, `${props.constants.APP_NAME}-Table`, {
            tableName: tableName.stringValue,
            grantIndexPermissions: true,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Lambda handler
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const commonLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.constants.APP_NAME}-CommonLayer`,
            commonLayerArn.stringValue
        );

        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.constants.APP_NAME}-PowertoolsLayer`,
            props.constants.ARN_POWERTOOLS_LAYER
        );

        const apiFn = new lambda.Function(this, `${props.constants.APP_NAME}-ApiHandler`, {
            functionName: `${props.constants.APP_NAME}-ApiHandler`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/api")),
            layers: [commonLayer, powertoolsLayer],
            environment: {
                TABLE_NAME: table.tableName,
                PROJECT_NAME: props.constants.APP_NAME,
            },
        });

        table.grantReadWriteData(apiFn);

        new logs.LogGroup(this, `${props.constants.APP_NAME}-ApiHandlerLogGroup`, {
            logGroupName: `/aws/lambda/${apiFn.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.TWO_WEEKS,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // API Gateway
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Authorizer for the API Gateway
        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, `${props.constants.APP_NAME}-Authorizer`, {
            authorizerName: `${props.constants.APP_NAME}-Authorizer`,
            cognitoUserPools: [userPool],
        });

        // Base API Gateway. @TODO Evaluate if this can be configured at API GW V2
        const apiGateway = new apigateway.LambdaRestApi(this, `${props.constants.APP_NAME}-Api`, {
            handler: apiFn,
            proxy: true,
            restApiName: `${props.constants.APP_NAME}-Api`,
            deployOptions: {
                stageName: "api",
            },
            endpointTypes: [apigateway.EndpointType.REGIONAL],
            minCompressionSize: Size.bytes(0),
            defaultCorsPreflightOptions: {
                allowOrigins: ["*"],
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: ["*", "Authorization"],
            },
            defaultMethodOptions: {
                authorizationType: apigateway.AuthorizationType.COGNITO,
                authorizer: authorizer,
            },
        });
    }
}
