/**
 * Auth Store - State Management Only
 *
 * Clean state management for authentication.
 * Uses AuthService for all authentication logic.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthService } from "@/services/authService";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    // State
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isLoading: true, // Start with loading until rehydration
            isAuthenticated: false,

            // Set user (used by auth service and rehydration)
            setUser: (user: User | null) => {
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                });
            },

            // Set loading state
            setLoading: (isLoading: boolean) => {
                set({ isLoading });
            },

            // Login action - delegates to AuthService
            login: async (email: string, password: string): Promise<boolean> => {
                const { setLoading, setUser } = get();

                setLoading(true);
                try {
                    const user = await AuthService.login({ email, password });
                    setUser(user);
                    return true;
                } catch (error) {
                    console.error("Login failed:", error);
                    setLoading(false);
                    return false;
                }
            },

            // Signup action - delegates to AuthService
            signup: async (email: string, password: string, name: string): Promise<boolean> => {
                const { setLoading, setUser } = get();

                setLoading(true);
                try {
                    const user = await AuthService.signup({ email, password, name });
                    setUser(user);
                    return true;
                } catch (error) {
                    console.error("Signup failed:", error);
                    setLoading(false);
                    return false;
                }
            },

            // Logout action - delegates to AuthService
            logout: async (): Promise<void> => {
                const { setUser } = get();

                try {
                    await AuthService.logout();
                    setUser(null);
                } catch (error) {
                    console.error("Logout error:", error);
                    // Even if logout fails, clear local state
                    setUser(null);
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist user data
            partialize: (state) => ({ user: state.user }),
            // Handle rehydration
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Sync authentication state with rehydrated user
                    state.isAuthenticated = !!state.user;
                    state.isLoading = false;

                    // Optional: Validate session on rehydration
                    if (state.user) {
                        AuthService.validateSession(state.user).then((isValid) => {
                            if (!isValid) {
                                // Session invalid, clear user
                                useAuthStore.getState().setUser(null);
                            }
                        });
                    }
                }
            },
        },
    ),
);

// Convenience hook that matches the old interface
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
