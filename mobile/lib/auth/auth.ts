import {
    AuthFlowType,
    ChangePasswordCommand,
    ConfirmForgotPasswordCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    GlobalSignOutCommand,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import { CLIENT_ID, cognitoClient } from "./config";
import { AuthError, ValidationError } from "./errors";
import { TokenStorage } from "./storage";
import { type AuthResult, TokenType, type User, type UserAttributes, UserSchema } from "./types";
import { extractAttributesFromToken, parseJwt } from "./utils";

const USER_ATTRIBUTES_KEY = "user_attributes";

export class AuthService {
    static async login(email: string, password: string): Promise<AuthResult> {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                ClientId: CLIENT_ID,
                // TODO: Add SRP_A and figure out how to use it
                AuthParameters: { USERNAME: email, PASSWORD: password },
            });

            const response = await cognitoClient.send(command);
            const result = response.AuthenticationResult;

            if (result?.AccessToken && result.IdToken && result.RefreshToken) {
                await TokenStorage.setToken(TokenType.Access, result.AccessToken);
                await TokenStorage.setToken(TokenType.Id, result.IdToken);
                await TokenStorage.setToken(TokenType.Refresh, result.RefreshToken);
                const userAttributes = extractAttributesFromToken(result.IdToken);
                await AsyncStorage.setItem(USER_ATTRIBUTES_KEY, JSON.stringify(userAttributes));
                return result;
            }
            throw new AuthError("Incomplete authentication result", "IncompleteAuthResult");
        } catch (error: any) {
            console.log(error);
            if (error.name === "UserNotConfirmedException") {
                throw new AuthError("User not confirmed", "UserNotConfirmedException");
            } else if (error.name === "UserNotFoundException" || error.name === "NotAuthorizedException") {
                throw new AuthError("Invalid email or password", error.name);
            } else {
                throw new AuthError(error.message, error.name);
            }
        }
    }

    static async signUp(user: User, recaptchaToken: string): Promise<void> {
        try {
            console.log(user);
            UserSchema.parse(user);
            const command = new SignUpCommand({
                ClientId: CLIENT_ID,
                Username: user.email,
                Password: user.password,
                UserAttributes: [
                    { Name: "email", Value: user.email },
                    { Name: "given_name", Value: user.firstName },
                    { Name: "family_name", Value: user.lastName },
                ],
                ValidationData: [{ Name: "recaptchaToken", Value: recaptchaToken }],
            });
            await cognitoClient.send(command);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                throw new ValidationError(error.errors.map((e: any) => e.message).join(", "));
            }
            throw new AuthError(error.message, error.name);
        }
    }

    static async confirmSignUp(email: string, code: string): Promise<void> {
        try {
            const command = new ConfirmSignUpCommand({
                ClientId: CLIENT_ID,
                Username: email,
                ConfirmationCode: code,
            });
            await cognitoClient.send(command);
        } catch (error: any) {
            throw new AuthError(error.message, error.name);
        }
    }

    static async forgotPassword(email: string): Promise<void> {
        try {
            const command = new ForgotPasswordCommand({
                ClientId: CLIENT_ID,
                Username: email,
            });
            await cognitoClient.send(command);
        } catch (error: any) {
            throw new AuthError(error.message, error.name);
        }
    }

    static async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: CLIENT_ID,
                Username: email,
                ConfirmationCode: code,
                Password: newPassword,
            });
            await cognitoClient.send(command);
        } catch (error: any) {
            throw new AuthError(error.message, error.name);
        }
    }

    static async logout(): Promise<void> {
        try {
            const accessToken = await TokenStorage.getToken(TokenType.Access);
            if (!accessToken) throw new AuthError("No access token found", "NoAccessToken");

            const command = new GlobalSignOutCommand({ AccessToken: accessToken });
            await cognitoClient.send(command);
            await TokenStorage.clearTokens();
            await AsyncStorage.removeItem(USER_ATTRIBUTES_KEY);
        } catch (error: any) {
            // If logout fails on server, still clear local tokens and user
            await TokenStorage.clearTokens();
            await AsyncStorage.removeItem(USER_ATTRIBUTES_KEY);
            throw new AuthError(error.message, error.name);
        }
    }

    static async isAuthenticated(): Promise<boolean> {
        const accessToken = await TokenStorage.getToken(TokenType.Access);
        const refreshToken = await TokenStorage.getToken(TokenType.Refresh);

        if (!accessToken || !refreshToken) return false;

        try {
            const decodedToken = parseJwt(accessToken);
            return decodedToken.exp > Date.now() / 1000;
        } catch (error) {
            // Invalid token
            return false;
        }
    }

    static async refreshSession(): Promise<AuthResult | null> {
        try {
            const refreshToken = await TokenStorage.getToken(TokenType.Refresh);
            if (!refreshToken) {
                // No refresh token, clear all tokens and user data as a precaution
                await TokenStorage.clearTokens();
                await AsyncStorage.removeItem(USER_ATTRIBUTES_KEY);
                throw new AuthError("No refresh token found", "NoRefreshToken");
            }

            const command = new InitiateAuthCommand({
                AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
                ClientId: CLIENT_ID,
                AuthParameters: { REFRESH_TOKEN: refreshToken },
            });

            const response = await cognitoClient.send(command);
            const result = response.AuthenticationResult;

            if (result?.AccessToken && result.IdToken) {
                await TokenStorage.setToken(TokenType.Access, result.AccessToken);
                await TokenStorage.setToken(TokenType.Id, result.IdToken);
                // Cognito might issue a new RefreshToken, but usually only if the previous one is about to expire or has been revoked.
                // The response AuthenticationResult does not always contain a new RefreshToken.
                // Only update it if a new one is provided.
                if (result.RefreshToken) {
                    await TokenStorage.setToken(TokenType.Refresh, result.RefreshToken);
                }
                return result;
            }
            // If refresh fails but didn't throw an exception leading to NoRefreshToken
            await TokenStorage.clearTokens();
            await AsyncStorage.removeItem(USER_ATTRIBUTES_KEY);
            throw new AuthError("Incomplete refresh result", "IncompleteRefreshResult");
        } catch (error: any) {
            // If refresh token is invalid or expired, Cognito will throw an error.
            // Clear tokens and user data.
            await TokenStorage.clearTokens();
            await AsyncStorage.removeItem(USER_ATTRIBUTES_KEY);
            throw new AuthError(error.message, error.name);
        }
    }

    static async checkAuthStatus(): Promise<boolean> {
        if (await this.isAuthenticated()) {
            return true;
        }

        try {
            const refreshed = await this.refreshSession();
            return !!refreshed;
        } catch (error) {
            console.log("Session refresh failed:", error);
            // Ensure tokens are cleared if refresh fails
            await TokenStorage.clearTokens();
            await AsyncStorage.removeItem(USER_ATTRIBUTES_KEY);
            return false;
        }
    }

    static async resendVerificationCode(email: string): Promise<void> {
        try {
            const command = new ResendConfirmationCodeCommand({
                ClientId: CLIENT_ID,
                Username: email,
            });
            await cognitoClient.send(command);
        } catch (error: any) {
            throw new AuthError(error.message, error.name);
        }
    }

    static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        try {
            const accessToken = await TokenStorage.getToken(TokenType.Access);
            if (!accessToken) {
                throw new AuthError("No access token found", "NoAccessToken");
            }

            const command = new ChangePasswordCommand({
                AccessToken: accessToken,
                PreviousPassword: oldPassword,
                ProposedPassword: newPassword,
            });

            await cognitoClient.send(command);
        } catch (error: any) {
            if (error.name === "InvalidPasswordException") {
                throw new AuthError("Invalid password format", error.name);
            } else if (error.name === "NotAuthorizedException") {
                throw new AuthError("Incorrect old password", error.name);
            } else {
                throw new AuthError(error.message, error.name);
            }
        }
    }

    static async getUser(): Promise<UserAttributes | null> {
        try {
            const userAttributesString = await AsyncStorage.getItem(USER_ATTRIBUTES_KEY);
            if (userAttributesString) {
                return JSON.parse(userAttributesString) as UserAttributes;
            }
            return null;
        } catch (error) {
            console.error("Failed to get user attributes from storage", error);
            return null;
        }
    }
}
