import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing auth token on app start
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");
            const userData = await AsyncStorage.getItem("user_data");

            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);

            // TODO: Replace with actual API call
            // For now, simulate login
            if (email && password) {
                const userData: User = {
                    id: "1",
                    email,
                    name: email.split("@")[0],
                };

                await AsyncStorage.setItem("auth_token", "fake_token_123");
                await AsyncStorage.setItem("user_data", JSON.stringify(userData));
                setUser(userData);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            setIsLoading(true);

            // TODO: Replace with actual API call
            // For now, simulate signup
            if (email && password && name) {
                const userData: User = {
                    id: "1",
                    email,
                    name,
                };

                await AsyncStorage.setItem("auth_token", "fake_token_123");
                await AsyncStorage.setItem("user_data", JSON.stringify(userData));
                setUser(userData);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Signup error:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem("auth_token");
            await AsyncStorage.removeItem("user_data");
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
