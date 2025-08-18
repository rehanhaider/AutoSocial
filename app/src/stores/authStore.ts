/**
 * Auth Store - Zustand
 *
 * Simple auth state management with hardcoded credentials.
 * Will be replaced with AWS Cognito later.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true, // Start with loading true until rehydration
            isAuthenticated: false,

            login: async (email: string, password: string): Promise<boolean> => {
                set({ isLoading: true });

                try {
                    // Simple hardcoded check
                    if (email === "justgoodin@gmail.com" && password === "B1smill@h") {
                        const userData: User = {
                            id: "1",
                            email,
                            name: "Justin Goodin",
                        };

                        set({
                            user: userData,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return true;
                    }

                    set({ isLoading: false });
                    return false;
                } catch (error) {
                    console.error("Login error:", error);
                    set({ isLoading: false });
                    return false;
                }
            },

            signup: async (email: string, password: string, name: string): Promise<boolean> => {
                set({ isLoading: true });

                try {
                    // For now, only allow the hardcoded email for signup too
                    if (email === "justgoodin@gmail.com" && password === "B1smill@h") {
                        const userData: User = {
                            id: "1",
                            email,
                            name: name || "Justin Goodin",
                        };

                        set({
                            user: userData,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return true;
                    }

                    set({ isLoading: false });
                    return false;
                } catch (error) {
                    console.error("Signup error:", error);
                    set({ isLoading: false });
                    return false;
                }
            },

            logout: async (): Promise<void> => {
                try {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error("Logout error:", error);
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist user data, not loading states
            partialize: (state) => ({ user: state.user }),
            // Handle rehydration automatically
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isAuthenticated = !!state.user;
                    state.isLoading = false;
                }
            },
        },
    ),
);

// Convenience hook that matches the old useAuth interface
export const useAuth = () => {
    const { user, isLoading, isAuthenticated, login, signup, logout } = useAuthStore();

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
    };
};
