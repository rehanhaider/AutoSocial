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

// Note: useTheme and ThemeProvider should be imported directly from their respective files
// to avoid circular dependencies

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

// Note: createShadows is now exported from utilities.ts to avoid circular dependencies

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
