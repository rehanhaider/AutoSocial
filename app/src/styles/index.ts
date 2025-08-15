import { Colors } from "@/styles/colors";
import { Fonts, Typography } from "@/styles/typography";

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
const createShadows = (isDark: boolean = false) => ({
    none: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.5 : 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: isDark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.6 : 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: isDark ? "#000000" : "#000000",
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

// Named exports for individual modules
export { Typography, Fonts, Colors, createShadows };

// Legacy Theme export (deprecated - import individual modules instead)
/** @deprecated Import specific modules like Colors, Typography, etc. directly */
export const Theme = {
    Colors,
    Fonts,
    Typography,
    Spacing,
    BorderRadius,
    Shadows: createShadows(false),
    Layout,
    Animation,
    createShadows,
};

export default Theme;
