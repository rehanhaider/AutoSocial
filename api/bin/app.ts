#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { AuthStack } from "../lib/auth-stack";
import { StorageStack } from "../lib/storage-stack";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = new cdk.App();

// Environment
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "us-east-1",
};

// Create stacks
const storageStack = new StorageStack(app, "AutoSocialStorageStack", { env });

const authStack = new AuthStack(app, "AutoSocialAuthStack", {
    env,
    userPoolName: "AutoSocialUserPool",
    userPoolClientName: "AutoSocialUserPoolClient",
});

const apiStack = new ApiStack(app, "AutoSocialApiStack", {
    env,
    userPool: authStack.userPool,
    postsTable: storageStack.postsTable,
    schedulesTable: storageStack.schedulesTable,
    mediaBucket: storageStack.mediaBucket,
});

// Add tags to all resources
cdk.Tags.of(app).add("Project", "AutoSocial");
cdk.Tags.of(app).add("Environment", process.env.ENVIRONMENT || "dev");

app.synth();
