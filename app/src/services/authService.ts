/**
 * Auth Service
 *
 * Handles all authentication logic and flows.
 * Separated from state management for reusability.
 */

interface User {
    id: string;
    email: string;
    name: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupCredentials {
    email: string;
    password: string;
    name: string;
}

export class AuthService {
    /**
     * Login with email/password
     * TODO: Replace with AWS Cognito
     */
    static async login(credentials: LoginCredentials): Promise<User | null> {
        const { email, password } = credentials;

        // Simple hardcoded check for now
        if (email === "justgoodin@gmail.com" && password === "B1smill@h") {
            return {
                id: "1",
                email,
                name: "Justin Goodin",
            };
        }

        throw new Error("Invalid email or password");
    }

    /**
     * Signup with email/password/name
     * TODO: Replace with AWS Cognito
     */
    static async signup(credentials: SignupCredentials): Promise<User | null> {
        const { email, password, name } = credentials;

        // For now, only allow the hardcoded email
        if (email === "justgoodin@gmail.com" && password === "B1smill@h") {
            return {
                id: "1",
                email,
                name: name || "Justin Goodin",
            };
        }

        throw new Error("Invalid credentials or user already exists");
    }

    /**
     * Logout user
     * TODO: Add token invalidation with AWS Cognito
     */
    static async logout(): Promise<void> {
        // For now, just resolve
        return Promise.resolve();
    }

    /**
     * Validate user session
     * TODO: Validate with AWS Cognito tokens
     */
    static async validateSession(user: User): Promise<boolean> {
        // For now, just check if user exists
        return !!user;
    }

    /**
     * Refresh user tokens
     * TODO: Implement with AWS Cognito refresh tokens
     */
    static async refreshTokens(): Promise<User | null> {
        // For now, just return null (no refresh needed)
        return null;
    }
}
