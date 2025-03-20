import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";

export class StorageStack extends cdk.Stack {
    public readonly postsTable: dynamodb.Table;
    public readonly schedulesTable: dynamodb.Table;
    public readonly mediaBucket: s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DynamoDB table for posts
        this.postsTable = new dynamodb.Table(this, "PostsTable", {
            tableName: "AutoSocial-Posts",
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // not for production
        });

        // Add GSI for user ID
        this.postsTable.addGlobalSecondaryIndex({
            indexName: "UserIdIndex",
            partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // DynamoDB table for schedules
        this.schedulesTable = new dynamodb.Table(this, "SchedulesTable", {
            tableName: "AutoSocial-Schedules",
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // not for production
        });

        // Add GSI for user ID
        this.schedulesTable.addGlobalSecondaryIndex({
            indexName: "UserIdIndex",
            partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // S3 bucket for media uploads
        this.mediaBucket = new s3.Bucket(this, "MediaBucket", {
            bucketName: "autosocial-media-" + this.account,
            cors: [
                {
                    allowedHeaders: ["*"],
                    allowedMethods: [
                        s3.HttpMethods.GET,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.DELETE,
                        s3.HttpMethods.HEAD,
                    ],
                    allowedOrigins: ["*"],
                    maxAge: 3000,
                },
            ],
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // not for production
            autoDeleteObjects: true, // not for production
        });

        // Output values
        new cdk.CfnOutput(this, "PostsTableName", {
            value: this.postsTable.tableName,
            exportName: "AutoSocialPostsTableName",
        });

        new cdk.CfnOutput(this, "SchedulesTableName", {
            value: this.schedulesTable.tableName,
            exportName: "AutoSocialSchedulesTableName",
        });

        new cdk.CfnOutput(this, "MediaBucketName", {
            value: this.mediaBucket.bucketName,
            exportName: "AutoSocialMediaBucketName",
        });
    }
}
