import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AuthContextType, AuthState, User } from "../types/auth";
import { authService } from "../utils/authService";

// Create the initial state
const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const isAuthenticated = await authService.isAuthenticated();

                if (isAuthenticated) {
                    const user = await authService.getCurrentUser();
                    setState({
                        isAuthenticated: true,
                        isLoading: false,
                        user,
                        error: null,
                    });
                } else {
                    setState({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                        error: null,
                    });
                }
            } catch (error) {
                setState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    error: error instanceof Error ? error.message : "Authentication check failed",
                });
            }
        };

        checkAuthStatus();
    }, []);

    // Sign in handler
    const signIn = async (username: string, password: string) => {
        try {
            setState({ ...state, isLoading: true, error: null });
            const user = await authService.signIn(username, password);
            setState({
                isAuthenticated: true,
                isLoading: false,
                user,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                isLoading: false,
                error: error instanceof Error ? error.message : "Sign in failed",
            });
            throw error;
        }
    };

    // Sign up handler
    const signUp = async (username: string, password: string, email: string) => {
        try {
            setState({ ...state, isLoading: true, error: null });
            await authService.signUp(username, password, email);
            setState({
                ...state,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                isLoading: false,
                error: error instanceof Error ? error.message : "Sign up failed",
            });
            throw error;
        }
    };

    // Confirm sign up handler
    const confirmSignUp = async (username: string, code: string) => {
        try {
            setState({ ...state, isLoading: true, error: null });
            await authService.confirmSignUp(username, code);
            setState({
                ...state,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                isLoading: false,
                error: error instanceof Error ? error.message : "Confirm sign up failed",
            });
            throw error;
        }
    };

    // Sign out handler
    const signOut = async () => {
        try {
            setState({ ...state, isLoading: true, error: null });
            await authService.signOut();
            setState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                isAuthenticated: false, // Force sign out even if API call fails
                user: null,
                isLoading: false,
                error: error instanceof Error ? error.message : "Sign out failed",
            });
        }
    };

    // Forgot password handler
    const forgotPassword = async (username: string) => {
        try {
            setState({ ...state, isLoading: true, error: null });
            await authService.forgotPassword(username);
            setState({
                ...state,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                isLoading: false,
                error: error instanceof Error ? error.message : "Forgot password request failed",
            });
            throw error;
        }
    };

    // Reset password handler
    const resetPassword = async (username: string, code: string, newPassword: string) => {
        try {
            setState({ ...state, isLoading: true, error: null });
            await authService.resetPassword(username, code, newPassword);
            setState({
                ...state,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                isLoading: false,
                error: error instanceof Error ? error.message : "Reset password failed",
            });
            throw error;
        }
    };

    // Create the context value
    const contextValue: AuthContextType = {
        ...state,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
        forgotPassword,
        resetPassword,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
