import { UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cognitoClient } from "./config";
import { AuthError, AuthService } from "./index";
import { TokenStorage } from "./storage";
import { type UserAttributes, TokenType } from "./types";

// Ensure this key is consistent with the one used in auth.ts
const USER_ATTRIBUTES_KEY = "user_attributes";

export class UserService {
    static async getUserAttributes(): Promise<UserAttributes | null> {
        let user = await AuthService.getUser();

        if (user) {
            return user;
        }

        // Optional: If no user data, try to refresh session and get user again
        // This depends on whether you expect getUserAttributes to be callable
        // when a session might be stale but refreshable.
        try {
            await AuthService.refreshSession(); // This internally updates tokens and user attributes on success
            user = await AuthService.getUser();
            if (user) {
                return user;
            }
        } catch (refreshError) {
            console.warn("UserService: Failed to refresh session while getting attributes", refreshError);
            // Fall through to throw GetAttributesFailed if user is still null
        }

        if (!user) {
            // If still no user after potential refresh, treat as failure to get attributes.
            // Depending on app logic, you might throw or return null.
            // Throwing an error might be more consistent if attributes are expected.
            throw new AuthError("Failed to get user attributes", "GetAttributesFailed");
        }
        return user; // Should be unreachable if the above throw happens, but satisfies TS
    }

    static async updateUserAttributes(attributesToUpdate: Partial<UserAttributes>): Promise<void> {
        const accessToken = await TokenStorage.getToken(TokenType.Access);
        if (!accessToken) {
            throw new AuthError("No access token found for updating attributes", "NoAccessToken");
        }

        try {
            const command = new UpdateUserAttributesCommand({
                AccessToken: accessToken,
                UserAttributes: Object.entries(attributesToUpdate)
                    .filter(([, value]) => value !== undefined) // Ensure no undefined values are sent
                    .map(([Name, Value]) => ({ Name, Value: Value as string })),
            });

            await cognitoClient.send(command);

            // Update stored user attributes locally
            const currentAttributes = await AuthService.getUser();
            if (!currentAttributes) {
                // This case should ideally not be reached if a user is updating their attributes,
                // as they should be authenticated and have attributes stored.
                // However, handle defensively.
                console.warn("UserService: No current attributes found after Cognito update. Storing only new attributes.");
                // If currentAttributes is null, we can only store what was provided.
                // This might lead to incomplete local data if attributesToUpdate is partial.
                // A better approach might be to re-fetch all attributes from Cognito after update,
                // but that's a more complex flow (e.g. calling getUserAttributes again or similar).
                // For now, merge with an empty object if null.
                const newAttributes: UserAttributes = { ...({} as UserAttributes), ...attributesToUpdate } as UserAttributes;
                await AsyncStorage.setItem(USER_ATTRIBUTES_KEY, JSON.stringify(newAttributes));
                return;
            }

            const updatedAttributes: UserAttributes = { ...currentAttributes };

            for (const key in attributesToUpdate) {
                if (Object.prototype.hasOwnProperty.call(attributesToUpdate, key)) {
                    const value = attributesToUpdate[key as keyof UserAttributes];
                    if (value !== undefined) {
                        updatedAttributes[key as keyof UserAttributes] = value;
                    }
                }
            }

            await AsyncStorage.setItem(USER_ATTRIBUTES_KEY, JSON.stringify(updatedAttributes));
        } catch (error: any) {
            console.error("UserService: Failed to update user attributes", error);
            throw new AuthError(error.message || "Failed to update attributes", error.name || "UpdateAttributesFailed");
        }
    }
}
