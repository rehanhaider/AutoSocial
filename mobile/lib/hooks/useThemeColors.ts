import { useTheme } from "./useTheme";

export function useThemeColors() {
    const { isDark } = useTheme();

    return {
        // Background colors
        background: isDark ? "#0f172a" : "#f8fafc",
        surface: isDark ? "#1e293b" : "#ffffff",
        card: isDark ? "#334155" : "#ffffff",

        // Text colors
        text: isDark ? "#f1f5f9" : "#1e293b",
        textSecondary: isDark ? "#94a3b8" : "#64748b",
        textMuted: isDark ? "#64748b" : "#94a3b8",

        // Border colors
        border: isDark ? "#374151" : "#e2e8f0",
        divider: isDark ? "#4b5563" : "#e2e8f0",

        // Primary colors
        primary: "#4f46e5",
        primaryText: "#ffffff",

        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // Icon colors
        iconPrimary: isDark ? "#94a3b8" : "#64748b",
        iconSecondary: isDark ? "#64748b" : "#94a3b8",

        // Input colors
        input: isDark ? "#374151" : "#ffffff",
        inputBorder: isDark ? "#4b5563" : "#d1d5db",
        inputText: isDark ? "#f9fafb" : "#1f2937",
        placeholder: isDark ? "#9ca3af" : "#6b7280",
    };
}
