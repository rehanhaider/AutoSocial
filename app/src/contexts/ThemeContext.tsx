/**
 * Theme Context
 *
 * Clean React context for theme management.
 * Handles light/dark mode switching and provides theme colors.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { ThemeContextValue, ThemeMode } from "@/types/theme";
import { buildTheme } from "@/styles/buildTheme";
import { useSettingsStore } from "@/state/settingStore";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const { theme: settingsTheme } = useSettingsStore();
    const [mode, setMode] = useState<ThemeMode>("light");

    // Resolve theme based on settings and system preference
    useEffect(() => {
        let resolvedMode: ThemeMode;

        if (settingsTheme === "system") {
            resolvedMode = systemColorScheme === "dark" ? "dark" : "light";
        } else if (settingsTheme === "premium") {
            resolvedMode = "premium";
        } else {
            resolvedMode = settingsTheme as ThemeMode;
        }

        setMode(resolvedMode);
    }, [settingsTheme, systemColorScheme]);

    // Build theme colors based on current mode
    const colors = buildTheme(mode);
    const isDark = mode === "dark";

    // Theme manipulation functions
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
    };

    const value: ThemeContextValue = {
        mode,
        colors,
        isDark,
        toggleTheme,
        setTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};
