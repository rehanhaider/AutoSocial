import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    GlobalSignOutCommand,
    InitiateAuthCommandInput,
    SignUpCommandInput,
    ConfirmSignUpCommandInput,
    ForgotPasswordCommandInput,
    ConfirmForgotPasswordCommandInput,
    GlobalSignOutCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { awsConfig } from "../config/aws-config";
import { User } from "../types/auth";

class AuthService {
    private client: CognitoIdentityProviderClient;

    constructor() {
        this.client = new CognitoIdentityProviderClient({
            region: awsConfig.region,
        });
    }

    // Sign in a user
    async signIn(username: string, password: string): Promise<User> {
        try {
            const params: InitiateAuthCommandInput = {
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: awsConfig.userPoolClientId,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password,
                },
            };

            const command = new InitiateAuthCommand(params);
            const response = await this.client.send(command);

            if (!response.AuthenticationResult) {
                throw new Error("Authentication failed");
            }

            const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

            // Store tokens
            await AsyncStorage.setItem(
                "userTokens",
                JSON.stringify({
                    idToken: IdToken,
                    accessToken: AccessToken,
                    refreshToken: RefreshToken,
                })
            );

            // Create user object
            // In a real app, you would decode the JWT to get user info
            const user: User = {
                id: username, // This should be replaced with actual user ID from token
                username,
                email: username, // This should be replaced with actual email from token
            };

            return user;
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    }

    // Sign up a new user
    async signUp(username: string, password: string, email: string): Promise<void> {
        try {
            const params: SignUpCommandInput = {
                ClientId: awsConfig.userPoolClientId,
                Username: username,
                Password: password,
                UserAttributes: [
                    {
                        Name: "email",
                        Value: email,
                    },
                ],
            };

            const command = new SignUpCommand(params);
            await this.client.send(command);
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    }

    // Confirm sign up with verification code
    async confirmSignUp(username: string, code: string): Promise<void> {
        try {
            const params: ConfirmSignUpCommandInput = {
                ClientId: awsConfig.userPoolClientId,
                Username: username,
                ConfirmationCode: code,
            };

            const command = new ConfirmSignUpCommand(params);
            await this.client.send(command);
        } catch (error) {
            console.error("Confirm sign up error:", error);
            throw error;
        }
    }

    // Sign out the current user
    async signOut(): Promise<void> {
        try {
            const tokensString = await AsyncStorage.getItem("userTokens");

            if (tokensString) {
                const tokens = JSON.parse(tokensString);

                const params: GlobalSignOutCommandInput = {
                    AccessToken: tokens.accessToken,
                };

                const command = new GlobalSignOutCommand(params);
                await this.client.send(command);
            }

            // Clear local storage
            await AsyncStorage.removeItem("userTokens");
        } catch (error) {
            console.error("Sign out error:", error);
            // Still clear tokens on error
            await AsyncStorage.removeItem("userTokens");
            throw error;
        }
    }

    // Request password reset
    async forgotPassword(username: string): Promise<void> {
        try {
            const params: ForgotPasswordCommandInput = {
                ClientId: awsConfig.userPoolClientId,
                Username: username,
            };

            const command = new ForgotPasswordCommand(params);
            await this.client.send(command);
        } catch (error) {
            console.error("Forgot password error:", error);
            throw error;
        }
    }

    // Confirm password reset with verification code
    async resetPassword(username: string, code: string, newPassword: string): Promise<void> {
        try {
            const params: ConfirmForgotPasswordCommandInput = {
                ClientId: awsConfig.userPoolClientId,
                Username: username,
                ConfirmationCode: code,
                Password: newPassword,
            };

            const command = new ConfirmForgotPasswordCommand(params);
            await this.client.send(command);
        } catch (error) {
            console.error("Reset password error:", error);
            throw error;
        }
    }

    // Check if the user is authenticated
    async isAuthenticated(): Promise<boolean> {
        try {
            const tokensString = await AsyncStorage.getItem("userTokens");
            return tokensString !== null;

            // In a real app, you would also check if the token is valid/not expired
        } catch (error) {
            console.error("Check authentication error:", error);
            return false;
        }
    }

    // Get the current user
    async getCurrentUser(): Promise<User | null> {
        try {
            const tokensString = await AsyncStorage.getItem("userTokens");

            if (!tokensString) {
                return null;
            }

            // In a real app, you would decode the JWT to get user info
            // For now, we'll return a placeholder user
            return {
                id: "placeholder-id",
                username: "placeholder-username",
                email: "placeholder-email",
            };
        } catch (error) {
            console.error("Get current user error:", error);
            return null;
        }
    }
}

export const authService = new AuthService();
