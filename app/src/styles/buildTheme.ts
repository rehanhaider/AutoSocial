/**
 * Theme Builder
 *
 * Creates light and dark themes from color primitives.
 * Handles semantic token mapping and ensures proper contrast.
 */

import { Theme, ThemeMode } from "@/types/theme";
import { primary, neutral, success, warning, error, info, pure, accent, premium } from "./primitives";
import { alpha, withOpacity as utilWithOpacity } from "./utilities";

// Helper to adjust opacity
const withOpacity = (hex: string, opacity: number): string => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
};

// Helper to create interactive states
const createInteractiveStates = (baseColor: string, isDark: boolean) => {
    // For dark mode, we lighten colors on interaction
    // For light mode, we darken colors on interaction
    const adjustColor = (color: string, amount: number): string => {
        if (isDark) {
            // Lighten for dark mode
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * amount);
            const R = Math.min(255, (num >> 16) + amt);
            const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
            const B = Math.min(255, (num & 0x0000ff) + amt);
            return "#" + ((R << 16) + (G << 8) + B).toString(16).padStart(6, "0");
        } else {
            // Darken for light mode
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * amount);
            const R = Math.max(0, (num >> 16) - amt);
            const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
            const B = Math.max(0, (num & 0x0000ff) - amt);
            return "#" + ((R << 16) + (G << 8) + B).toString(16).padStart(6, "0");
        }
    };

    return {
        default: baseColor,
        hover: adjustColor(baseColor, 10),
        pressed: adjustColor(baseColor, 20),
        disabled: isDark ? neutral[700] : neutral[300],
        selected: isDark ? withOpacity(baseColor, 0.2) : withOpacity(baseColor, 0.1),
    };
};

export const buildTheme = (mode: ThemeMode): Theme => {
    const isDark = mode === "dark";
    const isPremium = mode === "premium";

    // For dark mode, we need to invert the neutral scale for proper contrast
    // For premium mode, we use the premium color palette
    const neutralScale = isPremium
        ? premium.primary
        : isDark
          ? {
                50: neutral[900],
                100: neutral[800],
                200: neutral[700],
                300: neutral[600],
                400: neutral[500],
                500: neutral[400],
                600: neutral[300],
                700: neutral[200],
                800: neutral[100],
                900: neutral[50],
            }
          : neutral;

    return {
        surface: {
            primary: isPremium ? premium.primary[900] : isDark ? neutral[900] : pure.white,
            secondary: isPremium ? premium.primary[700] : isDark ? neutral[700] : neutral[50],
            tertiary: isPremium ? premium.primary[500] : isDark ? neutral[500] : neutral[100],
            inverse: isPremium ? premium.text[100] : isDark ? pure.white : neutral[900],
            overlay: isPremium ? "rgba(31, 52, 46, 0.80)" : isDark ? alpha[80] : alpha[50],
        },

        content: {
            primary: isPremium ? premium.text[100] : isDark ? neutralScale[900] : neutralScale[800],
            secondary: isPremium ? premium.text[200] : isDark ? neutralScale[600] : neutralScale[500],
            tertiary: isPremium ? premium.text[300] : isDark ? neutralScale[500] : neutralScale[400],
            disabled: isPremium ? premium.text[400] : isDark ? neutralScale[400] : neutralScale[300],
            inverse: isPremium ? premium.primary[900] : isDark ? neutralScale[100] : pure.white,
            accent: isPremium ? premium.accent[500] : isDark ? primary[400] : primary[600],
        },

        border: {
            primary: isPremium ? premium.text[400] : isDark ? neutralScale[300] : neutralScale[300],
            secondary: isPremium ? premium.text[300] : isDark ? neutralScale[200] : neutralScale[200],
            focus: isPremium ? premium.text[400] : isDark ? primary[400] : primary[500],
            accent: isPremium ? premium.accent[600] : isDark ? primary[600] : primary[300],
        },

        status: {
            success: isDark ? success[400] : success[600],
            warning: isDark ? warning[400] : warning[600],
            error: isDark ? error[400] : error[600],
            info: isDark ? info[400] : info[600],
            successBg: isDark ? withOpacity(success[400], 0.1) : success[50],
            warningBg: isDark ? withOpacity(warning[400], 0.1) : warning[50],
            errorBg: isDark ? withOpacity(error[400], 0.1) : error[50],
            infoBg: isDark ? withOpacity(info[400], 0.1) : info[50],
        },

        interactive: {
            primary: createInteractiveStates(isPremium ? premium.text[500] : isDark ? primary[600] : primary[500], isDark || isPremium),
            secondary: createInteractiveStates(
                isPremium ? premium.accent[600] : isDark ? neutralScale[600] : neutralScale[400],
                isDark || isPremium,
            ),
            neutral: createInteractiveStates(
                isPremium ? premium.primary[700] : isDark ? neutralScale[700] : neutralScale[200],
                isDark || isPremium,
            ),
        },

        palette: {
            primary: isPremium ? premium.text : primary,
            neutral: neutralScale,
            success,
            warning,
            error,
            info,
        },

        pure,
        accent,
    };
};

// Pre-built themes
export const lightTheme = buildTheme("light");
export const darkTheme = buildTheme("dark");
export const premiumTheme = buildTheme("premium");
