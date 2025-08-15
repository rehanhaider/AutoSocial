/**
 * Unified Theme Hook
 *
 * Single hook for all theme-related needs:
 * - Colors (semantic tokens)
 * - Theme state (isDark, isPremium, etc.)
 * - Theme-aware utilities (shadows, etc.)
 */

import { useTheme as useThemeContext } from "@/contexts/ThemeContext";
import { createShadows } from "@/styles";

export const useTheme = () => {
    const { colorScheme, colors, isDark, isPremium } = useThemeContext();

    // Create theme-aware utilities
    const shadows = createShadows(isDark);

    return {
        // Theme state
        colorScheme,
        isDark,
        isPremium,

        // Colors (semantic tokens)
        colors,

        // Theme-aware utilities
        shadows,
    };
};

export default useTheme;
