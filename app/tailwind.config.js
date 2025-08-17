// app/tailwind.config.js
const {
  primary,
  neutral,
  success,
  warning,
  error,
  info,
  pure,
  accent,
  premium,
} = require('./src/styles/primitives');
const { Spacing, BorderRadius } = require('./src/styles');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This enables class-based dark mode
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 1. Map all your color primitives
      colors: {
        ...primary,
        ...neutral,
        ...success,
        ...warning,
        ...error,
        ...info,
        ...pure,
        ...accent,
        premium: {
          ...premium.primary,
          accent: premium.accent,
          text: premium.text,
        },
        // 2. Define semantic colors using CSS variables
        // This is how we translate your `buildTheme` logic
        surface: {
          primary: 'rgba(var(--surface-primary) / <alpha-value>)',
          secondary: 'rgba(var(--surface-secondary) / <alpha-value>)',
          tertiary: 'rgba(var(--surface-tertiary) / <alpha-value>)',
          inverse: 'rgba(var(--surface-inverse) / <alpha-value>)',
        },
        content: {
          primary: 'rgba(var(--content-primary) / <alpha-value>)',
          secondary: 'rgba(var(--content-secondary) / <alpha-value>)',
          tertiary: 'rgba(var(--content-tertiary) / <alpha-value>)',
          disabled: 'rgba(var(--content-disabled) / <alpha-value>)',
          inverse: 'rgba(var(--content-inverse) / <alpha-value>)',
          accent: 'rgba(var(--content-accent) / <alpha-value>)',
        },
        border: {
          primary: 'rgba(var(--border-primary) / <alpha-value>)',
          secondary: 'rgba(var(--border-secondary) / <alpha-value>)',
          focus: 'rgba(var(--border-focus) / <alpha-value>)',
          accent: 'rgba(var(--border-accent) / <alpha-value>)',
        },
        status: {
            success: 'rgba(var(--status-success) / <alpha-value>)',
            warning: 'rgba(var(--status-warning) / <alpha-value>)',
            error: 'rgba(var(--status-error) / <alpha-value>)',
            info: 'rgba(var(--status-info) / <alpha-value>)',
        }
      },
      // 3. Map spacing and border radius
      spacing: Spacing,
      borderRadius: BorderRadius,
      // 4. Map font families
      fontFamily: {
        primary: ['Inter-Regular', 'sans-serif'],
        'primary-light': ['Inter-Light', 'sans-serif'],
        'primary-medium': ['Inter-Medium', 'sans-serif'],
        'primary-semibold': ['Inter-SemiBold', 'sans-serif'],
        'primary-bold': ['Inter-Bold', 'sans-serif'],
        'primary-extrabold': ['Inter-ExtraBold', 'sans-serif'],
        secondary: ['Inter-Regular', 'sans-serif'], // Assuming secondary is also Inter
        accent: ['Lora-Regular', 'serif'],
        'accent-medium': ['Lora-Medium', 'serif'],
        'accent-semibold': ['Lora-SemiBold', 'serif'],
        'accent-bold': ['Lora-Bold', 'serif'],
      },
    },
  },
  plugins: [],
};