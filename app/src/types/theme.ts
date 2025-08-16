/**
 * Color System Types
 *
 * Clean, comprehensive type definitions for our color system.
 * No brand-specific or legacy types - just semantic design tokens.
 */

// Base color scale (50-900 range for consistency)
export interface ColorScale {
    50: string; // Lightest
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Base/Primary
    600: string;
    700: string;
    800: string;
    900: string; // Darkest
}

// Semantic surface tokens for backgrounds
export interface SurfaceTokens {
    primary: string; // Main background
    secondary: string; // Subtle background
    tertiary: string; // Card/elevated surfaces
    inverse: string; // High contrast surface
    overlay: string; // Modal/drawer overlays
}

// Semantic content tokens for text and icons
export interface ContentTokens {
    primary: string; // High emphasis text
    secondary: string; // Medium emphasis text
    tertiary: string; // Low emphasis text
    disabled: string; // Disabled state
    inverse: string; // Text on dark surfaces
    accent: string; // Branded text
}

// Semantic border tokens
export interface BorderTokens {
    primary: string; // Default borders
    secondary: string; // Subtle borders
    focus: string; // Focus indicators
    accent: string; // Branded borders
}

// Status/feedback tokens
export interface StatusTokens {
    success: string;
    warning: string;
    error: string;
    info: string;
    successBg: string;
    warningBg: string;
    errorBg: string;
    infoBg: string;
}

// Interactive state tokens
export interface InteractiveTokens {
    default: string;
    hover: string;
    pressed: string;
    disabled: string;
    selected: string;
}

// Complete theme interface
export interface Theme {
    surface: SurfaceTokens;
    content: ContentTokens;
    border: BorderTokens;
    status: StatusTokens;
    interactive: {
        primary: InteractiveTokens;
        secondary: InteractiveTokens;
        neutral: InteractiveTokens;
    };
    // Raw palette access when needed
    palette: {
        primary: ColorScale;
        neutral: ColorScale;
        success: ColorScale;
        warning: ColorScale;
        error: ColorScale;
        info: ColorScale;
    };
    // Pure values
    pure: {
        white: string;
        black: string;
        transparent: string;
    };
    // Accent colors for branding and highlights
    accent: {
        orange: string;
        green: string;
        red: string;
        purple: string;
        yellow: string;
        redditRed: string;
    };
}

// Theme modes
export type ThemeMode = "light" | "dark" | "premium";

// Theme context interface
export interface ThemeContextValue {
    mode: ThemeMode;
    colors: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}
