/**
 * Color System Utilities
 *
 * Helper functions and utility values for the color system.
 * Includes alpha values, color manipulation, and common patterns.
 */

// Common alpha values for overlays and transparency
export const alpha = {
    5: "rgba(0, 0, 0, 0.05)",
    10: "rgba(0, 0, 0, 0.10)",
    20: "rgba(0, 0, 0, 0.20)",
    30: "rgba(0, 0, 0, 0.30)",
    40: "rgba(0, 0, 0, 0.40)",
    50: "rgba(0, 0, 0, 0.50)",
    60: "rgba(0, 0, 0, 0.60)",
    70: "rgba(0, 0, 0, 0.70)",
    80: "rgba(0, 0, 0, 0.80)",
    90: "rgba(0, 0, 0, 0.90)",
} as const;

// Helper to adjust opacity on hex colors
export const withOpacity = (hex: string, opacity: number): string => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
};
