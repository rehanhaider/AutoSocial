import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenType } from "./types";

export class TokenStorage {
    static async setToken(type: TokenType, token: string): Promise<void> {
        await AsyncStorage.setItem(`token_${type}`, token);
    }

    static async getToken(type: TokenType): Promise<string | null> {
        return await AsyncStorage.getItem(`token_${type}`);
    }

    static async removeToken(type: TokenType): Promise<void> {
        await AsyncStorage.removeItem(`token_${type}`);
    }

    static async clearTokens(): Promise<void> {
        const keys = Object.values(TokenType).map((type) => `token_${type}`);
        await AsyncStorage.multiRemove(keys);
    }
}
