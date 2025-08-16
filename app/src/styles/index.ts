/**
 * Design System Index
 *
 * Clean exports for the entire design system.
 * Import what you need from here.
 */

// Theme system
export * from "./primitives";
export * from "./buildTheme";
export * from "./utilities";

// Typography system
export { Typography, Fonts } from "./typography";

// Theme utilities
export { useTheme } from "@/hooks/useTheme";
export { ThemeProvider } from "@/contexts/ThemeContext";

// Design tokens (non-color)
export const Spacing = {
    xxs: 3,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
};

// Theme-aware shadow system
export const createShadows = (isDark: boolean = false) => ({
    none: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.5 : 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.6 : 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: isDark ? 0.7 : 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
});

export const Layout = {
    window: {
        width: "100%",
        height: "100%",
    },
    container: {
        paddingHorizontal: Spacing.md,
    },
    safeArea: {
        flex: 1,
    },
};

export const Animation = {
    timing: {
        fast: 200,
        normal: 300,
        slow: 500,
    },
    easing: {
        easeInOut: "easeInOut",
        easeIn: "easeIn",
        easeOut: "easeOut",
    },
};
