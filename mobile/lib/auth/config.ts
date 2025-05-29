import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

// TODO: Configure these environment variables in your React Native setup
export const REGION = process.env.EXPO_PUBLIC_AWS_REGION;
export const CLIENT_ID = process.env.EXPO_PUBLIC_APP_CLIENT_ID;
export const RECAPTCHA_CLIENT_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_CLIENT_KEY;

export const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });
