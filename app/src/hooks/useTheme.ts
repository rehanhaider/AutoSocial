/**
 * useTheme Hook
 *
 * Main hook for consuming theme colors and utilities.
 * Provides easy access to all theme-related functionality.
 */

import { useThemeContext } from "@/contexts/ThemeContext";
import { Theme, ThemeMode } from "@/types/theme";
import { createShadows } from "@/styles";

interface UseThemeReturn {
    // Theme state
    mode: ThemeMode;
    colorScheme: ThemeMode; // Compatibility alias
    isDark: boolean;

    // All theme colors and tokens
    colors: Theme;

    // Quick access to commonly used colors
    surface: Theme["surface"];
    content: Theme["content"];
    border: Theme["border"];
    status: Theme["status"];
    interactive: Theme["interactive"];

    // Theme utilities
    shadows: ReturnType<typeof createShadows>;

    // Theme manipulation
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;

    // Utility functions
    withOpacity: (color: string, opacity: number) => string;
}

export const useTheme = (): UseThemeReturn => {
    const { mode, colors, isDark, toggleTheme, setTheme } = useThemeContext();
    const isPremium = mode === "premium";

    // Create theme-aware shadows (premium theme should behave like dark mode for shadows)
    const shadows = createShadows(isDark || isPremium);

    // Utility function for adding opacity to colors
    const withOpacity = (hex: string, opacity: number): string => {
        const cleanHex = hex.replace("#", "");
        const num = parseInt(cleanHex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
    };

    return {
        // Theme state
        mode,
        colorScheme: mode, // Compatibility alias
        isDark,

        // All colors
        colors,

        // Quick access to color categories
        surface: colors.surface,
        content: colors.content,
        border: colors.border,
        status: colors.status,
        interactive: colors.interactive,

        // Theme utilities
        shadows,

        // Theme controls
        toggleTheme,
        setTheme,

        // Utilities
        withOpacity,
    };
};

export default useTheme;
