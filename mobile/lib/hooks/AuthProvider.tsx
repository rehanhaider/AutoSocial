import { AuthService } from "@/lib/auth";
import { UserAttributes } from "@/lib/auth/types";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./useAuth"; // Import from useAuth.ts

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔐 AuthProvider: isAuthenticated state changed to:", isAuthenticated);
    }, [isAuthenticated]);

    const checkAuthStatus = async () => {
        console.log("🔐 AuthProvider: checking auth status...");
        setLoading(true);
        try {
            const authStatus = await AuthService.checkAuthStatus();
            setIsAuthenticated(authStatus);
            if (authStatus) {
                const user = await AuthService.getUser();
                setUserAttributes(user);
                console.log("🔐 AuthProvider: User is authenticated", user);
            } else {
                setUserAttributes(null);
                console.log("🔐 AuthProvider: User is not authenticated");
            }
        } catch (error) {
            console.error("🔐 AuthProvider: Auth initialization failed:", error);
            setIsAuthenticated(false);
            setUserAttributes(null);
        } finally {
            setLoading(false);
            console.log("🔐 AuthProvider: auth status check finished, loading:", false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        console.log("🔐 AuthProvider: login process started...");
        setLoading(true);
        try {
            await AuthService.login(email, password);
            const user = await AuthService.getUser();
            setUserAttributes(user);
            setIsAuthenticated(true);
            console.log("🔐 AuthProvider: login successful, user:", user);
            return true;
        } catch (error) {
            console.error("🔐 AuthProvider: Login failed:", error);
            setIsAuthenticated(false);
            setUserAttributes(null);
            throw error;
        } finally {
            setLoading(false);
            console.log("🔐 AuthProvider: login process finished, loading:", false);
        }
    };

    const logout = async () => {
        console.log("🔐 AuthProvider: logout process started...");
        setLoading(true);
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("🔐 AuthProvider: Logout failed:", error);
        } finally {
            setIsAuthenticated(false);
            setUserAttributes(null);
            setLoading(false);
            console.log("🔐 AuthProvider: logout process finished, loading:", false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                userAttributes,
                loading,
                login,
                logout,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
