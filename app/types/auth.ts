export interface User {
    id: string;
    username: string;
    email: string;
    attributes?: Record<string, any>;
}

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string, email: string) => Promise<void>;
    confirmSignUp: (username: string, code: string) => Promise<void>;
    signOut: () => Promise<void>;
    forgotPassword: (username: string) => Promise<void>;
    resetPassword: (username: string, code: string, newPassword: string) => Promise<void>;
}
