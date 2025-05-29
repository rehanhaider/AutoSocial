import { AuthService } from "@/lib/auth";
import { UserAttributes } from "@/lib/auth/types";
import { useEffect, useState } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserData = async () => {
        try {
            const user = await AuthService.getUser();
            setUserAttributes(user);
        } catch (error) {
            console.error("Failed to load user data:", error);
            setUserAttributes(null);
        }
    };

    const checkAuthStatus = async () => {
        try {
            const authStatus = await AuthService.checkAuthStatus();
            setIsAuthenticated(authStatus);

            if (authStatus) {
                await loadUserData();
            } else {
                setUserAttributes(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
            setUserAttributes(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await AuthService.login(email, password);
            await checkAuthStatus();
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setIsAuthenticated(false);
            setUserAttributes(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        await loadUserData();
    };

    return {
        isAuthenticated,
        userAttributes,
        loading,
        login,
        logout,
        refreshUserData,
        checkAuthStatus,
    };
}
