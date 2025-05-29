import { UserAttributes } from "@/lib/auth/types";
import { createContext, useContext } from "react";

// Define the shape of the context data
export interface AuthContextType {
    isAuthenticated: boolean | null;
    userAttributes: UserAttributes | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

// Create the context with an undefined initial value
// The actual value will be provided by AuthProvider in AuthProvider.tsx
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
