import { decode } from "js-base64";
import { type TokenPayload, type UserAttributes } from "./types";

export function parseJwt(token: string): TokenPayload {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decode(base64));
}

export function extractAttributesFromToken(token: string): UserAttributes {
    const payload = parseJwt(token);
    return {
        email: payload.email,
        given_name: payload.given_name,
        family_name: payload.family_name,
    };
}

// User display utilities
export function getUserInitials(userAttributes: UserAttributes | null): string {
    if (!userAttributes || !userAttributes.given_name || !userAttributes.family_name) {
        return "U";
    }
    return (userAttributes.given_name.charAt(0) + userAttributes.family_name.charAt(0)).toUpperCase();
}

export function getUserFirstName(userAttributes: UserAttributes | null): string {
    if (!userAttributes || !userAttributes.given_name) {
        return "User";
    }
    return userAttributes.given_name;
}

export function getUserFullName(userAttributes: UserAttributes | null): string {
    if (!userAttributes || !userAttributes.given_name || !userAttributes.family_name) {
        return "User";
    }
    return `${userAttributes.given_name} ${userAttributes.family_name}`;
}

export function getUserEmail(userAttributes: UserAttributes | null): string {
    if (!userAttributes || !userAttributes.email) {
        return "";
    }
    return userAttributes.email;
}
