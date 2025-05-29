import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "user_theme_preference";

export function useTheme() {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>("system");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
                setThemeMode(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error("Failed to load theme preference:", error);
        } finally {
            setLoading(false);
        }
    };

    const setTheme = async (theme: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
            setThemeMode(theme);
        } catch (error) {
            console.error("Failed to save theme preference:", error);
            throw error;
        }
    };

    const getCurrentTheme = () => {
        if (themeMode === "system") {
            return systemColorScheme;
        }
        return themeMode;
    };

    const isDark = getCurrentTheme() === "dark";

    return {
        themeMode,
        setTheme,
        getCurrentTheme,
        isDark,
        loading,
        systemColorScheme,
    };
}
