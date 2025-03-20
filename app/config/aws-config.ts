import { AWS_REGION, AWS_USER_POOL_ID, AWS_USER_POOL_CLIENT_ID, AWS_IDENTITY_POOL_ID, S3_BUCKET } from "@env";

export const awsConfig = {
    region: AWS_REGION,
    userPoolId: AWS_USER_POOL_ID,
    userPoolClientId: AWS_USER_POOL_CLIENT_ID,
    identityPoolId: AWS_IDENTITY_POOL_ID,
    s3Bucket: S3_BUCKET,
};
