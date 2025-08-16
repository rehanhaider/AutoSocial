/**
 * Color Primitives
 *
 * Raw color values that form the foundation of our design system.
 * All colors are WCAG AA compliant for accessibility.
 * Uses standard 50-900 scale for consistency.
 */

import { ColorScale } from "@/types/theme";

// Primary brand colors (Blue scale)
export const primary: ColorScale = {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Primary brand color
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
};

// Neutral grays (optimized for text and UI)
export const neutral: ColorScale = {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
};

// Success colors (Green scale)
export const success: ColorScale = {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
};

// Warning colors (Amber scale)
export const warning: ColorScale = {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
};

// Error colors (Red scale)
export const error: ColorScale = {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
};

// Info colors (Cyan scale)
export const info: ColorScale = {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
};

// Pure values
export const pure = {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
} as const;

// Premium theme colors (forest green and navy)
export const premium = {
    // Premium primary (forest green scale)
    primary: {
        50: "#f4f6f5",
        100: "#e8ebe9",
        200: "#c5d1ca",
        300: "#9bb0a3",
        400: "#6d8a77",
        500: "#4a6854",
        600: "#3a5343",
        700: "#2d4135",
        800: "#1f342e", // Base premium dark green
        900: "#152520",
    },
    // Premium accent (navy scale)
    accent: {
        50: "#f1f3f6",
        100: "#e3e7ed",
        200: "#c1cad8",
        300: "#95a6bc",
        400: "#647a9a",
        500: "#485d7d",
        600: "#394864",
        700: "#2d3a51",
        800: "#1e2b3f",
        900: "#071932", // Base premium navy
    },
    // Premium text (bronze scale)
    text: {
        50: "#fefdfb",
        100: "#fdf9f1",
        200: "#faf1de",
        300: "#f5e4b8",
        400: "#efd285",
        500: "#dbbe7d", // Base premium bronze
        600: "#c9a665",
        700: "#a88c55",
        800: "#8a7248",
        900: "#715e3d",
    },
} as const;

// Accent colors for branding and highlights
export const accent = {
    orange: "#ea580c",
    green: "#16a34a",
    red: "#dc2626",
    purple: "#9333ea",
    yellow: "#ca8a04",
    redditRed: "#ff4500",
} as const;
