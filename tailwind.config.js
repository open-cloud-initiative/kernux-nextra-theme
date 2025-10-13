// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-kern-theme="dark"]'],
  content: ["./css/**/*.css", "./src/**/*.tsx"],
  theme: {
    extend: {
      spacing: {
        xxs: "var(--kern-metric-space-2x-small)",
        xs: "var(--kern-metric-space-x-small)",
        sm: "var(--kern-metric-space-small)",
        md: "var(--kern-metric-space-default)",
        lg: "var(--kern-metric-space-large)",
        xl: "var(--kern-metric-space-x-large)",
      },
    },
    fontSize: {
      xs: [
        "var(--kern-typography-font-size-static-small)",
        "var(--kern-typography-line-height-static-medium)",
      ],
      sm: [
        "var(--kern-typography-font-size-static-small)",
        "var(--kern-typography-line-height-static-medium)",
      ],
      base: [
        "var(--kern-typography-font-size-static-medium)",
        "var(--kern-typography-line-height-static-medium)",
      ],
      lg: [
        "var(--kern-typography-font-size-static-large)",
        "var(--kern-typography-line-height-static-large)",
      ],
      xl: [
        "var(--kern-typography-font-size-adaptive-x-large)",
        "var(--kern-typography-line-height-adaptive-x-large)",
      ],
      "2xl": [
        "var(--kern-typography-font-size-adaptive-2x-large)",
        "var(--kern-typography-line-height-adaptive-2x-large)",
      ],
      "3xl": [
        "var(--kern-typography-font-size-adaptive-3x-large)",
        "var(--kern-typography-line-height-adaptive-3x-large)",
      ],
    },
    letterSpacing: {
      tight: "-0.015em",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      "kern-layout-text": "var(--kern-color-layout-text-default)",
      "kern-layout-text-muted": "var(--kern-color-layout-text-muted)",
      "kern-layout-text-inverse": "var(--kern-color-layout-text-inverse)",
      "kern-layout-border": "var(--kern-color-layout-border)",
      "kern-layout-background-default":
        "var(--kern-color-layout-background-default)",
      "kern-layout-background-hued": "var(--kern-color-layout-background-hued)",
      "kern-form-inputs-background": "var(--kern-color-form-inputs-background)",
      "kern-form-inputs-background-inverted":
        "var(--kern-color-form-inputs-background-inverted)",
      "kern-action-default": "var(--kern-color-action-default)",
      "kern-action-on-default": "var(--kern-color-action-on-default)",
      "kern-action-visited": "var(--kern-color-action-visited)",
      "kern-action-focus-background":
        "var(--kern-color-action-focus-background)",
      "kern-action-focus-border-inside":
        "var(--kern-color-action-focus-border-inside)",
      "kern-action-focus-border-outside":
        "var(--kern-color-action-focus-border-outside)",
      "kern-action-state-indicator-default":
        "var(--kern-color-action-state-indicator-default)",
      "kern-action-state-indicator-tint":
        "var(--kern-color-action-state-indicator-tint)",
      "kern-action-state-indicator-shade":
        "var(--kern-color-action-state-indicator-shade)",
      "kern-action-state-opacity-hover":
        "var(--kern-color-action-state-opacity-hover)",
      "kern-action-state-opacity-pressed":
        "var(--kern-color-action-state-opacity-pressed)",
      "kern-action-state-opacity-selected":
        "var(--kern-color-action-state-opacity-selected)",
      "kern-action-state-opacity-active":
        "var(--kern-color-action-state-opacity-active)",
      "kern-action-state-opacity-disabled":
        "var(--kern-color-action-state-opacity-disabled)",
      "kern-action-state-opacity-overlay":
        "var(--kern-color-action-state-opacity-overlay)",
      "kern-feedback-success": "var(--kern-color-feedback-success)",
      "kern-feedback-success-background":
        "var(--kern-color-feedback-success-background)",
      "kern-feedback-info": "var(--kern-color-feedback-info)",
      "kern-feedback-info-background":
        "var(--kern-color-feedback-info-background)",
      "kern-feedback-danger": "var(--kern-color-feedback-danger)",
      "kern-feedback-danger-background":
        "var(--kern-color-feedback-danger-background)",
      "kern-feedback-warning": "var(--kern-color-feedback-warning)",
      "kern-feedback-warning-background":
        "var(--kern-color-feedback-warning-background)",
      "kern-feedback-loader": "var(--kern-color-feedback-loader)",
      "kern-feedback-loader-background":
        "var(--kern-color-feedback-loader-background)",

      "kern-action-state-indicator-shade-hover":
        "var(--kern-color-action-state-indicator-shade-hover)",
      "kern-action-state-indicator-shade-active":
        "var(--kern-color-action-state-indicator-shade-active)",
      "kern-action-state-indicator-tint-hover":
        "var(--kern-color-action-state-indicator-tint-hover)",
      "kern-action-state-indicator-tint-active":
        "var(--kern-color-action-state-indicator-tint-active)",
      "kern-action-state-indicator-tint-hover-opacity":
        "var(--kern-color-action-state-indicator-tint-hover-opacity)",

      "kern-darkblue-025":
        "oklch(var(--kern-darkblue-025-lightness) var(--kern-darkblue-025-chroma) var(--kern-darkblue-025-hue))",
      "kern-darkblue-050":
        "oklch(var(--kern-darkblue-050-lightness) var(--kern-darkblue-050-chroma) var(--kern-darkblue-050-hue))",
      "kern-darkblue-100":
        "oklch(var(--kern-darkblue-100-lightness) var(--kern-darkblue-100-chroma) var(--kern-darkblue-100-hue))",
      "kern-darkblue-150":
        "oklch(var(--kern-darkblue-150-lightness) var(--kern-darkblue-150-chroma) var(--kern-darkblue-150-hue))",
      "kern-darkblue-200":
        "oklch(var(--kern-darkblue-200-lightness) var(--kern-darkblue-200-chroma) var(--kern-darkblue-200-hue))",
      "kern-darkblue-250":
        "oklch(var(--kern-darkblue-250-lightness) var(--kern-darkblue-250-chroma) var(--kern-darkblue-250-hue))",
      "kern-darkblue-300":
        "oklch(var(--kern-darkblue-300-lightness) var(--kern-darkblue-300-chroma) var(--kern-darkblue-300-hue))",
      "kern-darkblue-350":
        "oklch(var(--kern-darkblue-350-lightness) var(--kern-darkblue-350-chroma) var(--kern-darkblue-350-hue))",
      "kern-darkblue-400":
        "oklch(var(--kern-darkblue-400-lightness) var(--kern-darkblue-400-chroma) var(--kern-darkblue-400-hue))",
      "kern-darkblue-450":
        "oklch(var(--kern-darkblue-450-lightness) var(--kern-darkblue-450-chroma) var(--kern-darkblue-450-hue))",
      "kern-darkblue-500":
        "oklch(var(--kern-darkblue-500-lightness) var(--kern-darkblue-500-chroma) var(--kern-darkblue-500-hue))",
      "kern-darkblue-550":
        "oklch(var(--kern-darkblue-550-lightness) var(--kern-darkblue-550-chroma) var(--kern-darkblue-550-hue))",
      "kern-darkblue-600":
        "oklch(var(--kern-darkblue-600-lightness) var(--kern-darkblue-600-chroma) var(--kern-darkblue-600-hue))",
      "kern-darkblue-650":
        "oklch(var(--kern-darkblue-650-lightness) var(--kern-darkblue-650-chroma) var(--kern-darkblue-650-hue))",
      "kern-darkblue-700":
        "oklch(var(--kern-darkblue-700-lightness) var(--kern-darkblue-700-chroma) var(--kern-darkblue-700-hue))",
      "kern-darkblue-750":
        "oklch(var(--kern-darkblue-750-lightness) var(--kern-darkblue-750-chroma) var(--kern-darkblue-750-hue))",
      "kern-darkblue-800":
        "oklch(var(--kern-darkblue-800-lightness) var(--kern-darkblue-800-chroma) var(--kern-darkblue-800-hue))",
      "kern-darkblue-850":
        "oklch(var(--kern-darkblue-850-lightness) var(--kern-darkblue-850-chroma) var(--kern-darkblue-850-hue))",
      "kern-darkblue-900":
        "oklch(var(--kern-darkblue-900-lightness) var(--kern-darkblue-900-chroma) var(--kern-darkblue-900-hue))",
      "kern-darkblue-950":
        "oklch(var(--kern-darkblue-950-lightness) var(--kern-darkblue-950-chroma) var(--kern-darkblue-950-hue))",

      "kern-lightblue-025":
        "oklch(var(--kern-lightblue-025-lightness) var(--kern-lightblue-025-chroma) var(--kern-lightblue-025-hue))",
      "kern-lightblue-050":
        "oklch(var(--kern-lightblue-050-lightness) var(--kern-lightblue-050-chroma) var(--kern-lightblue-050-hue))",
      "kern-lightblue-100":
        "oklch(var(--kern-lightblue-100-lightness) var(--kern-lightblue-100-chroma) var(--kern-lightblue-100-hue))",
      "kern-lightblue-150":
        "oklch(var(--kern-lightblue-150-lightness) var(--kern-lightblue-150-chroma) var(--kern-lightblue-150-hue))",
      "kern-lightblue-200":
        "oklch(var(--kern-lightblue-200-lightness) var(--kern-lightblue-200-chroma) var(--kern-lightblue-200-hue))",
      "kern-lightblue-250":
        "oklch(var(--kern-lightblue-250-lightness) var(--kern-lightblue-250-chroma) var(--kern-lightblue-250-hue))",
      "kern-lightblue-300":
        "oklch(var(--kern-lightblue-300-lightness) var(--kern-lightblue-300-chroma) var(--kern-lightblue-300-hue))",
      "kern-lightblue-350":
        "oklch(var(--kern-lightblue-350-lightness) var(--kern-lightblue-350-chroma) var(--kern-lightblue-350-hue))",
      "kern-lightblue-400":
        "oklch(var(--kern-lightblue-400-lightness) var(--kern-lightblue-400-chroma) var(--kern-lightblue-400-hue))",
      "kern-lightblue-450":
        "oklch(var(--kern-lightblue-450-lightness) var(--kern-lightblue-450-chroma) var(--kern-lightblue-450-hue))",
      "kern-lightblue-500":
        "oklch(var(--kern-lightblue-500-lightness) var(--kern-lightblue-500-chroma) var(--kern-lightblue-500-hue))",
      "kern-lightblue-550":
        "oklch(var(--kern-lightblue-550-lightness) var(--kern-lightblue-550-chroma) var(--kern-lightblue-550-hue))",
      "kern-lightblue-600":
        "oklch(var(--kern-lightblue-600-lightness) var(--kern-lightblue-600-chroma) var(--kern-lightblue-600-hue))",
      "kern-lightblue-650":
        "oklch(var(--kern-lightblue-650-lightness) var(--kern-lightblue-650-chroma) var(--kern-lightblue-650-hue))",
      "kern-lightblue-700":
        "oklch(var(--kern-lightblue-700-lightness) var(--kern-lightblue-700-chroma) var(--kern-lightblue-700-hue))",
      "kern-lightblue-750":
        "oklch(var(--kern-lightblue-750-lightness) var(--kern-lightblue-750-chroma) var(--kern-lightblue-750-hue))",
      "kern-lightblue-800":
        "oklch(var(--kern-lightblue-800-lightness) var(--kern-lightblue-800-chroma) var(--kern-lightblue-800-hue))",
      "kern-lightblue-850":
        "oklch(var(--kern-lightblue-850-lightness) var(--kern-lightblue-850-chroma) var(--kern-lightblue-850-hue))",
      "kern-lightblue-900":
        "oklch(var(--kern-lightblue-900-lightness) var(--kern-lightblue-900-chroma) var(--kern-lightblue-900-hue))",
      "kern-lightblue-950":
        "oklch(var(--kern-lightblue-950-lightness) var(--kern-lightblue-950-chroma) var(--kern-lightblue-950-hue))",

      "kern-turquoise-025":
        "oklch(var(--kern-turquoise-025-lightness) var(--kern-turquoise-025-chroma) var(--kern-turquoise-025-hue))",
      "kern-turquoise-050":
        "oklch(var(--kern-turquoise-050-lightness) var(--kern-turquoise-050-chroma) var(--kern-turquoise-050-hue))",
      "kern-turquoise-100":
        "oklch(var(--kern-turquoise-100-lightness) var(--kern-turquoise-100-chroma) var(--kern-turquoise-100-hue))",
      "kern-turquoise-150":
        "oklch(var(--kern-turquoise-150-lightness) var(--kern-turquoise-150-chroma) var(--kern-turquoise-150-hue))",
      "kern-turquoise-200":
        "oklch(var(--kern-turquoise-200-lightness) var(--kern-turquoise-200-chroma) var(--kern-turquoise-200-hue))",
      "kern-turquoise-250":
        "oklch(var(--kern-turquoise-250-lightness) var(--kern-turquoise-250-chroma) var(--kern-turquoise-250-hue))",
      "kern-turquoise-300":
        "oklch(var(--kern-turquoise-300-lightness) var(--kern-turquoise-300-chroma) var(--kern-turquoise-300-hue))",
      "kern-turquoise-350":
        "oklch(var(--kern-turquoise-350-lightness) var(--kern-turquoise-350-chroma) var(--kern-turquoise-350-hue))",
      "kern-turquoise-400":
        "oklch(var(--kern-turquoise-400-lightness) var(--kern-turquoise-400-chroma) var(--kern-turquoise-400-hue))",
      "kern-turquoise-450":
        "oklch(var(--kern-turquoise-450-lightness) var(--kern-turquoise-450-chroma) var(--kern-turquoise-450-hue))",
      "kern-turquoise-500":
        "oklch(var(--kern-turquoise-500-lightness) var(--kern-turquoise-500-chroma) var(--kern-turquoise-500-hue))",
      "kern-turquoise-550":
        "oklch(var(--kern-turquoise-550-lightness) var(--kern-turquoise-550-chroma) var(--kern-turquoise-550-hue))",
      "kern-turquoise-600":
        "oklch(var(--kern-turquoise-600-lightness) var(--kern-turquoise-600-chroma) var(--kern-turquoise-600-hue))",
      "kern-turquoise-650":
        "oklch(var(--kern-turquoise-650-lightness) var(--kern-turquoise-650-chroma) var(--kern-turquoise-650-hue))",
      "kern-turquoise-700":
        "oklch(var(--kern-turquoise-700-lightness) var(--kern-turquoise-700-chroma) var(--kern-turquoise-700-hue))",
      "kern-turquoise-750":
        "oklch(var(--kern-turquoise-750-lightness) var(--kern-turquoise-750-chroma) var(--kern-turquoise-750-hue))",
      "kern-turquoise-800":
        "oklch(var(--kern-turquoise-800-lightness) var(--kern-turquoise-800-chroma) var(--kern-turquoise-800-hue))",
      "kern-turquoise-850":
        "oklch(var(--kern-turquoise-850-lightness) var(--kern-turquoise-850-chroma) var(--kern-turquoise-850-hue))",
      "kern-turquoise-900":
        "oklch(var(--kern-turquoise-900-lightness) var(--kern-turquoise-900-chroma) var(--kern-turquoise-900-hue))",
      "kern-turquoise-950":
        "oklch(var(--kern-turquoise-950-lightness) var(--kern-turquoise-950-chroma) var(--kern-turquoise-950-hue))",

      "kern-green-025":
        "oklch(var(--kern-green-025-lightness) var(--kern-green-025-chroma) var(--kern-green-025-hue))",
      "kern-green-050":
        "oklch(var(--kern-green-050-lightness) var(--kern-green-050-chroma) var(--kern-green-050-hue))",
      "kern-green-100":
        "oklch(var(--kern-green-100-lightness) var(--kern-green-100-chroma) var(--kern-green-100-hue))",
      "kern-green-150":
        "oklch(var(--kern-green-150-lightness) var(--kern-green-150-chroma) var(--kern-green-150-hue))",
      "kern-green-200":
        "oklch(var(--kern-green-200-lightness) var(--kern-green-200-chroma) var(--kern-green-200-hue))",
      "kern-green-250":
        "oklch(var(--kern-green-250-lightness) var(--kern-green-250-chroma) var(--kern-green-250-hue))",
      "kern-green-300":
        "oklch(var(--kern-green-300-lightness) var(--kern-green-300-chroma) var(--kern-green-300-hue))",
      "kern-green-350":
        "oklch(var(--kern-green-350-lightness) var(--kern-green-350-chroma) var(--kern-green-350-hue))",
      "kern-green-400":
        "oklch(var(--kern-green-400-lightness) var(--kern-green-400-chroma) var(--kern-green-400-hue))",
      "kern-green-450":
        "oklch(var(--kern-green-450-lightness) var(--kern-green-450-chroma) var(--kern-green-450-hue))",
      "kern-green-500":
        "oklch(var(--kern-green-500-lightness) var(--kern-green-500-chroma) var(--kern-green-500-hue))",
      "kern-green-550":
        "oklch(var(--kern-green-550-lightness) var(--kern-green-550-chroma) var(--kern-green-550-hue))",
      "kern-green-600":
        "oklch(var(--kern-green-600-lightness) var(--kern-green-600-chroma) var(--kern-green-600-hue))",
      "kern-green-650":
        "oklch(var(--kern-green-650-lightness) var(--kern-green-650-chroma) var(--kern-green-650-hue))",
      "kern-green-700":
        "oklch(var(--kern-green-700-lightness) var(--kern-green-700-chroma) var(--kern-green-700-hue))",
      "kern-green-750":
        "oklch(var(--kern-green-750-lightness) var(--kern-green-750-chroma) var(--kern-green-750-hue))",
      "kern-green-800":
        "oklch(var(--kern-green-800-lightness) var(--kern-green-800-chroma) var(--kern-green-800-hue))",
      "kern-green-850":
        "oklch(var(--kern-green-850-lightness) var(--kern-green-850-chroma) var(--kern-green-850-hue))",
      "kern-green-900":
        "oklch(var(--kern-green-900-lightness) var(--kern-green-900-chroma) var(--kern-green-900-hue))",
      "kern-green-950":
        "oklch(var(--kern-green-950-lightness) var(--kern-green-950-chroma) var(--kern-green-950-hue))",

      "kern-limette-025":
        "oklch(var(--kern-limette-025-lightness) var(--kern-limette-025-chroma) var(--kern-limette-025-hue))",
      "kern-limette-050":
        "oklch(var(--kern-limette-050-lightness) var(--kern-limette-050-chroma) var(--kern-limette-050-hue))",
      "kern-limette-100":
        "oklch(var(--kern-limette-100-lightness) var(--kern-limette-100-chroma) var(--kern-limette-100-hue))",
      "kern-limette-150":
        "oklch(var(--kern-limette-150-lightness) var(--kern-limette-150-chroma) var(--kern-limette-150-hue))",
      "kern-limette-200":
        "oklch(var(--kern-limette-200-lightness) var(--kern-limette-200-chroma) var(--kern-limette-200-hue))",
      "kern-limette-250":
        "oklch(var(--kern-limette-250-lightness) var(--kern-limette-250-chroma) var(--kern-limette-250-hue))",
      "kern-limette-300":
        "oklch(var(--kern-limette-300-lightness) var(--kern-limette-300-chroma) var(--kern-limette-300-hue))",
      "kern-limette-350":
        "oklch(var(--kern-limette-350-lightness) var(--kern-limette-350-chroma) var(--kern-limette-350-hue))",
      "kern-limette-400":
        "oklch(var(--kern-limette-400-lightness) var(--kern-limette-400-chroma) var(--kern-limette-400-hue))",
      "kern-limette-450":
        "oklch(var(--kern-limette-450-lightness) var(--kern-limette-450-chroma) var(--kern-limette-450-hue))",
      "kern-limette-500":
        "oklch(var(--kern-limette-500-lightness) var(--kern-limette-500-chroma) var(--kern-limette-500-hue))",
      "kern-limette-550":
        "oklch(var(--kern-limette-550-lightness) var(--kern-limette-550-chroma) var(--kern-limette-550-hue))",
      "kern-limette-600":
        "oklch(var(--kern-limette-600-lightness) var(--kern-limette-600-chroma) var(--kern-limette-600-hue))",
      "kern-limette-650":
        "oklch(var(--kern-limette-650-lightness) var(--kern-limette-650-chroma) var(--kern-limette-650-hue))",
      "kern-limette-700":
        "oklch(var(--kern-limette-700-lightness) var(--kern-limette-700-chroma) var(--kern-limette-700-hue))",
      "kern-limette-750":
        "oklch(var(--kern-limette-750-lightness) var(--kern-limette-750-chroma) var(--kern-limette-750-hue))",
      "kern-limette-800":
        "oklch(var(--kern-limette-800-lightness) var(--kern-limette-800-chroma) var(--kern-limette-800-hue))",
      "kern-limette-850":
        "oklch(var(--kern-limette-850-lightness) var(--kern-limette-850-chroma) var(--kern-limette-850-hue))",
      "kern-limette-900":
        "oklch(var(--kern-limette-900-lightness) var(--kern-limette-900-chroma) var(--kern-limette-900-hue))",
      "kern-limette-950":
        "oklch(var(--kern-limette-950-lightness) var(--kern-limette-950-chroma) var(--kern-limette-950-hue))",

      "kern-yellow-025":
        "oklch(var(--kern-yellow-025-lightness) var(--kern-yellow-025-chroma) var(--kern-yellow-025-hue))",
      "kern-yellow-050":
        "oklch(var(--kern-yellow-050-lightness) var(--kern-yellow-050-chroma) var(--kern-yellow-050-hue))",
      "kern-yellow-100":
        "oklch(var(--kern-yellow-100-lightness) var(--kern-yellow-100-chroma) var(--kern-yellow-100-hue))",
      "kern-yellow-150":
        "oklch(var(--kern-yellow-150-lightness) var(--kern-yellow-150-chroma) var(--kern-yellow-150-hue))",
      "kern-yellow-200":
        "oklch(var(--kern-yellow-200-lightness) var(--kern-yellow-200-chroma) var(--kern-yellow-200-hue))",
      "kern-yellow-250":
        "oklch(var(--kern-yellow-250-lightness) var(--kern-yellow-250-chroma) var(--kern-yellow-250-hue))",
      "kern-yellow-300":
        "oklch(var(--kern-yellow-300-lightness) var(--kern-yellow-300-chroma) var(--kern-yellow-300-hue))",
      "kern-yellow-350":
        "oklch(var(--kern-yellow-350-lightness) var(--kern-yellow-350-chroma) var(--kern-yellow-350-hue))",
      "kern-yellow-400":
        "oklch(var(--kern-yellow-400-lightness) var(--kern-yellow-400-chroma) var(--kern-yellow-400-hue))",
      "kern-yellow-450":
        "oklch(var(--kern-yellow-450-lightness) var(--kern-yellow-450-chroma) var(--kern-yellow-450-hue))",
      "kern-yellow-500":
        "oklch(var(--kern-yellow-500-lightness) var(--kern-yellow-500-chroma) var(--kern-yellow-500-hue))",
      "kern-yellow-550":
        "oklch(var(--kern-yellow-550-lightness) var(--kern-yellow-550-chroma) var(--kern-yellow-550-hue))",
      "kern-yellow-600":
        "oklch(var(--kern-yellow-600-lightness) var(--kern-yellow-600-chroma) var(--kern-yellow-600-hue))",
      "kern-yellow-650":
        "oklch(var(--kern-yellow-650-lightness) var(--kern-yellow-650-chroma) var(--kern-yellow-650-hue))",
      "kern-yellow-700":
        "oklch(var(--kern-yellow-700-lightness) var(--kern-yellow-700-chroma) var(--kern-yellow-700-hue))",
      "kern-yellow-750":
        "oklch(var(--kern-yellow-750-lightness) var(--kern-yellow-750-chroma) var(--kern-yellow-750-hue))",
      "kern-yellow-800":
        "oklch(var(--kern-yellow-800-lightness) var(--kern-yellow-800-chroma) var(--kern-yellow-800-hue))",
      "kern-yellow-850":
        "oklch(var(--kern-yellow-850-lightness) var(--kern-yellow-850-chroma) var(--kern-yellow-850-hue))",
      "kern-yellow-900":
        "oklch(var(--kern-yellow-900-lightness) var(--kern-yellow-900-chroma) var(--kern-yellow-900-hue))",
      "kern-yellow-950":
        "oklch(var(--kern-yellow-950-lightness) var(--kern-yellow-950-chroma) var(--kern-yellow-950-hue))",

      "kern-orange-025":
        "oklch(var(--kern-orange-025-lightness) var(--kern-orange-025-chroma) var(--kern-orange-025-hue))",
      "kern-orange-050":
        "oklch(var(--kern-orange-050-lightness) var(--kern-orange-050-chroma) var(--kern-orange-050-hue))",
      "kern-orange-100":
        "oklch(var(--kern-orange-100-lightness) var(--kern-orange-100-chroma) var(--kern-orange-100-hue))",
      "kern-orange-150":
        "oklch(var(--kern-orange-150-lightness) var(--kern-orange-150-chroma) var(--kern-orange-150-hue))",
      "kern-orange-200":
        "oklch(var(--kern-orange-200-lightness) var(--kern-orange-200-chroma) var(--kern-orange-200-hue))",
      "kern-orange-250":
        "oklch(var(--kern-orange-250-lightness) var(--kern-orange-250-chroma) var(--kern-orange-250-hue))",
      "kern-orange-300":
        "oklch(var(--kern-orange-300-lightness) var(--kern-orange-300-chroma) var(--kern-orange-300-hue))",
      "kern-orange-350":
        "oklch(var(--kern-orange-350-lightness) var(--kern-orange-350-chroma) var(--kern-orange-350-hue))",
      "kern-orange-400":
        "oklch(var(--kern-orange-400-lightness) var(--kern-orange-400-chroma) var(--kern-orange-400-hue))",
      "kern-orange-450":
        "oklch(var(--kern-orange-450-lightness) var(--kern-orange-450-chroma) var(--kern-orange-450-hue))",
      "kern-orange-500":
        "oklch(var(--kern-orange-500-lightness) var(--kern-orange-500-chroma) var(--kern-orange-500-hue))",
      "kern-orange-550":
        "oklch(var(--kern-orange-550-lightness) var(--kern-orange-550-chroma) var(--kern-orange-550-hue))",
      "kern-orange-600":
        "oklch(var(--kern-orange-600-lightness) var(--kern-orange-600-chroma) var(--kern-orange-600-hue))",
      "kern-orange-650":
        "oklch(var(--kern-orange-650-lightness) var(--kern-orange-650-chroma) var(--kern-orange-650-hue))",
      "kern-orange-700":
        "oklch(var(--kern-orange-700-lightness) var(--kern-orange-700-chroma) var(--kern-orange-700-hue))",
      "kern-orange-750":
        "oklch(var(--kern-orange-750-lightness) var(--kern-orange-750-chroma) var(--kern-orange-750-hue))",
      "kern-orange-800":
        "oklch(var(--kern-orange-800-lightness) var(--kern-orange-800-chroma) var(--kern-orange-800-hue))",
      "kern-orange-850":
        "oklch(var(--kern-orange-850-lightness) var(--kern-orange-850-chroma) var(--kern-orange-850-hue))",
      "kern-orange-900":
        "oklch(var(--kern-orange-900-lightness) var(--kern-orange-900-chroma) var(--kern-orange-900-hue))",
      "kern-orange-950":
        "oklch(var(--kern-orange-950-lightness) var(--kern-orange-950-chroma) var(--kern-orange-950-hue))",

      "kern-red-025":
        "oklch(var(--kern-red-025-lightness) var(--kern-red-025-chroma) var(--kern-red-025-hue))",
      "kern-red-050":
        "oklch(var(--kern-red-050-lightness) var(--kern-red-050-chroma) var(--kern-red-050-hue))",
      "kern-red-100":
        "oklch(var(--kern-red-100-lightness) var(--kern-red-100-chroma) var(--kern-red-100-hue))",
      "kern-red-150":
        "oklch(var(--kern-red-150-lightness) var(--kern-red-150-chroma) var(--kern-red-150-hue))",
      "kern-red-200":
        "oklch(var(--kern-red-200-lightness) var(--kern-red-200-chroma) var(--kern-red-200-hue))",
      "kern-red-250":
        "oklch(var(--kern-red-250-lightness) var(--kern-red-250-chroma) var(--kern-red-250-hue))",
      "kern-red-300":
        "oklch(var(--kern-red-300-lightness) var(--kern-red-300-chroma) var(--kern-red-300-hue))",
      "kern-red-350":
        "oklch(var(--kern-red-350-lightness) var(--kern-red-350-chroma) var(--kern-red-350-hue))",
      "kern-red-400":
        "oklch(var(--kern-red-400-lightness) var(--kern-red-400-chroma) var(--kern-red-400-hue))",
      "kern-red-450":
        "oklch(var(--kern-red-450-lightness) var(--kern-red-450-chroma) var(--kern-red-450-hue))",
      "kern-red-500":
        "oklch(var(--kern-red-500-lightness) var(--kern-red-500-chroma) var(--kern-red-500-hue))",
      "kern-red-550":
        "oklch(var(--kern-red-550-lightness) var(--kern-red-550-chroma) var(--kern-red-550-hue))",
      "kern-red-600":
        "oklch(var(--kern-red-600-lightness) var(--kern-red-600-chroma) var(--kern-red-600-hue))",
      "kern-red-650":
        "oklch(var(--kern-red-650-lightness) var(--kern-red-650-chroma) var(--kern-red-650-hue))",
      "kern-red-700":
        "oklch(var(--kern-red-700-lightness) var(--kern-red-700-chroma) var(--kern-red-700-hue))",
      "kern-red-750":
        "oklch(var(--kern-red-750-lightness) var(--kern-red-750-chroma) var(--kern-red-750-hue))",
      "kern-red-800":
        "oklch(var(--kern-red-800-lightness) var(--kern-red-800-chroma) var(--kern-red-800-hue))",
      "kern-red-850":
        "oklch(var(--kern-red-850-lightness) var(--kern-red-850-chroma) var(--kern-red-850-hue))",
      "kern-red-900":
        "oklch(var(--kern-red-900-lightness) var(--kern-red-900-chroma) var(--kern-red-900-hue))",
      "kern-red-950":
        "oklch(var(--kern-red-950-lightness) var(--kern-red-950-chroma) var(--kern-red-950-hue))",

      "kern-violet-025":
        "oklch(var(--kern-violet-025-lightness) var(--kern-violet-025-chroma) var(--kern-violet-025-hue))",
      "kern-violet-050":
        "oklch(var(--kern-violet-050-lightness) var(--kern-violet-050-chroma) var(--kern-violet-050-hue))",
      "kern-violet-100":
        "oklch(var(--kern-violet-100-lightness) var(--kern-violet-100-chroma) var(--kern-violet-100-hue))",
      "kern-violet-150":
        "oklch(var(--kern-violet-150-lightness) var(--kern-violet-150-chroma) var(--kern-violet-150-hue))",
      "kern-violet-200":
        "oklch(var(--kern-violet-200-lightness) var(--kern-violet-200-chroma) var(--kern-violet-200-hue))",
      "kern-violet-250":
        "oklch(var(--kern-violet-250-lightness) var(--kern-violet-250-chroma) var(--kern-violet-250-hue))",
      "kern-violet-300":
        "oklch(var(--kern-violet-300-lightness) var(--kern-violet-300-chroma) var(--kern-violet-300-hue))",
      "kern-violet-350":
        "oklch(var(--kern-violet-350-lightness) var(--kern-violet-350-chroma) var(--kern-violet-350-hue))",
      "kern-violet-400":
        "oklch(var(--kern-violet-400-lightness) var(--kern-violet-400-chroma) var(--kern-violet-400-hue))",
      "kern-violet-450":
        "oklch(var(--kern-violet-450-lightness) var(--kern-violet-450-chroma) var(--kern-violet-450-hue))",
      "kern-violet-500":
        "oklch(var(--kern-violet-500-lightness) var(--kern-violet-500-chroma) var(--kern-violet-500-hue))",
      "kern-violet-550":
        "oklch(var(--kern-violet-550-lightness) var(--kern-violet-550-chroma) var(--kern-violet-550-hue))",
      "kern-violet-600":
        "oklch(var(--kern-violet-600-lightness) var(--kern-violet-600-chroma) var(--kern-violet-600-hue))",
      "kern-violet-650":
        "oklch(var(--kern-violet-650-lightness) var(--kern-violet-650-chroma) var(--kern-violet-650-hue))",
      "kern-violet-700":
        "oklch(var(--kern-violet-700-lightness) var(--kern-violet-700-chroma) var(--kern-violet-700-hue))",
      "kern-violet-750":
        "oklch(var(--kern-violet-750-lightness) var(--kern-violet-750-chroma) var(--kern-violet-750-hue))",
      "kern-violet-800":
        "oklch(var(--kern-violet-800-lightness) var(--kern-violet-800-chroma) var(--kern-violet-800-hue))",
      "kern-violet-850":
        "oklch(var(--kern-violet-850-lightness) var(--kern-violet-850-chroma) var(--kern-violet-850-hue))",
      "kern-violet-900":
        "oklch(var(--kern-violet-900-lightness) var(--kern-violet-900-chroma) var(--kern-violet-900-hue))",
      "kern-violet-950":
        "oklch(var(--kern-violet-950-lightness) var(--kern-violet-950-chroma) var(--kern-violet-950-hue))",

      "kern-neutral-025":
        "oklch(var(--kern-neutral-025-lightness) var(--kern-neutral-025-chroma) var(--kern-neutral-025-hue))",
      "kern-neutral-050":
        "oklch(var(--kern-neutral-050-lightness) var(--kern-neutral-050-chroma) var(--kern-neutral-050-hue))",
      "kern-neutral-100":
        "oklch(var(--kern-neutral-100-lightness) var(--kern-neutral-100-chroma) var(--kern-neutral-100-hue))",
      "kern-neutral-150":
        "oklch(var(--kern-neutral-150-lightness) var(--kern-neutral-150-chroma) var(--kern-neutral-150-hue))",
      "kern-neutral-200":
        "oklch(var(--kern-neutral-200-lightness) var(--kern-neutral-200-chroma) var(--kern-neutral-200-hue))",
      "kern-neutral-250":
        "oklch(var(--kern-neutral-250-lightness) var(--kern-neutral-250-chroma) var(--kern-neutral-250-hue))",
      "kern-neutral-300":
        "oklch(var(--kern-neutral-300-lightness) var(--kern-neutral-300-chroma) var(--kern-neutral-300-hue))",
      "kern-neutral-350":
        "oklch(var(--kern-neutral-350-lightness) var(--kern-neutral-350-chroma) var(--kern-neutral-350-hue))",
      "kern-neutral-400":
        "oklch(var(--kern-neutral-400-lightness) var(--kern-neutral-400-chroma) var(--kern-neutral-400-hue))",
      "kern-neutral-450":
        "oklch(var(--kern-neutral-450-lightness) var(--kern-neutral-450-chroma) var(--kern-neutral-450-hue))",
      "kern-neutral-500":
        "oklch(var(--kern-neutral-500-lightness) var(--kern-neutral-500-chroma) var(--kern-neutral-500-hue))",
      "kern-neutral-550":
        "oklch(var(--kern-neutral-550-lightness) var(--kern-neutral-550-chroma) var(--kern-neutral-550-hue))",
      "kern-neutral-600":
        "oklch(var(--kern-neutral-600-lightness) var(--kern-neutral-600-chroma) var(--kern-neutral-600-hue))",
      "kern-neutral-650":
        "oklch(var(--kern-neutral-650-lightness) var(--kern-neutral-650-chroma) var(--kern-neutral-650-hue))",
      "kern-neutral-700":
        "oklch(var(--kern-neutral-700-lightness) var(--kern-neutral-700-chroma) var(--kern-neutral-700-hue))",
      "kern-neutral-750":
        "oklch(var(--kern-neutral-750-lightness) var(--kern-neutral-750-chroma) var(--kern-neutral-750-hue))",
      "kern-neutral-800":
        "oklch(var(--kern-neutral-800-lightness) var(--kern-neutral-800-chroma) var(--kern-neutral-800-hue))",
      "kern-neutral-850":
        "oklch(var(--kern-neutral-850-lightness) var(--kern-neutral-850-chroma) var(--kern-neutral-850-hue))",
      "kern-neutral-900":
        "oklch(var(--kern-neutral-900-lightness) var(--kern-neutral-900-chroma) var(--kern-neutral-900-hue))",
      "kern-neutral-950":
        "oklch(var(--kern-neutral-950-lightness) var(--kern-neutral-950-chroma) var(--kern-neutral-950-hue))",

      "kern-gray-025":
        "oklch(var(--kern-gray-025-lightness) var(--kern-gray-025-chroma) var(--kern-gray-025-hue))",
      "kern-gray-050":
        "oklch(var(--kern-gray-050-lightness) var(--kern-gray-050-chroma) var(--kern-gray-050-hue))",
      "kern-gray-100":
        "oklch(var(--kern-gray-100-lightness) var(--kern-gray-100-chroma) var(--kern-gray-100-hue))",
      "kern-gray-150":
        "oklch(var(--kern-gray-150-lightness) var(--kern-gray-150-chroma) var(--kern-gray-150-hue))",
      "kern-gray-200":
        "oklch(var(--kern-gray-200-lightness) var(--kern-gray-200-chroma) var(--kern-gray-200-hue))",
      "kern-gray-250":
        "oklch(var(--kern-gray-250-lightness) var(--kern-gray-250-chroma) var(--kern-gray-250-hue))",
      "kern-gray-300":
        "oklch(var(--kern-gray-300-lightness) var(--kern-gray-300-chroma) var(--kern-gray-300-hue))",
      "kern-gray-350":
        "oklch(var(--kern-gray-350-lightness) var(--kern-gray-350-chroma) var(--kern-gray-350-hue))",
      "kern-gray-400":
        "oklch(var(--kern-gray-400-lightness) var(--kern-gray-400-chroma) var(--kern-gray-400-hue))",
      "kern-gray-450":
        "oklch(var(--kern-gray-450-lightness) var(--kern-gray-450-chroma) var(--kern-gray-450-hue))",
      "kern-gray-500":
        "oklch(var(--kern-gray-500-lightness) var(--kern-gray-500-chroma) var(--kern-gray-500-hue))",
      "kern-gray-550":
        "oklch(var(--kern-gray-550-lightness) var(--kern-gray-550-chroma) var(--kern-gray-550-hue))",
      "kern-gray-600":
        "oklch(var(--kern-gray-600-lightness) var(--kern-gray-600-chroma) var(--kern-gray-600-hue))",
      "kern-gray-650":
        "oklch(var(--kern-gray-650-lightness) var(--kern-gray-650-chroma) var(--kern-gray-650-hue))",
      "kern-gray-700":
        "oklch(var(--kern-gray-700-lightness) var(--kern-gray-700-chroma) var(--kern-gray-700-hue))",
      "kern-gray-750":
        "oklch(var(--kern-gray-750-lightness) var(--kern-gray-750-chroma) var(--kern-gray-750-hue))",
      "kern-gray-800":
        "oklch(var(--kern-gray-800-lightness) var(--kern-gray-800-chroma) var(--kern-gray-800-hue))",
      "kern-gray-850":
        "oklch(var(--kern-gray-850-lightness) var(--kern-gray-850-chroma) var(--kern-gray-850-hue))",
      "kern-gray-900":
        "oklch(var(--kern-gray-900-lightness) var(--kern-gray-900-chroma) var(--kern-gray-900-hue))",
      "kern-gray-950":
        "oklch(var(--kern-gray-950-lightness) var(--kern-gray-950-chroma) var(--kern-gray-950-hue))",

      footer: {
        DEFAULT: "var(--footer-color-background)",
        foreground: "var(--footer-color-foreground)",
      },

      border: "var(--kern-color-layout-border)",
      input: "var(--kern-color-form-input-background)",
      ring: "var(--kern-color-form-input-border)",
      background: "var(--kern-color-layout-background-default)",
      foreground: "var(--kern-color-layout-text-default)",
      primary: {
        DEFAULT: "var(--kern-color-action-default)",
        foreground: "var(--kern-color-action-on-default)",
      },
      secondary: {
        DEFAULT: "red",
        foreground: "red",
      },
      destructive: {
        DEFAULT: "var(--kern-color-feedback-danger-background)",
        foreground: "var(--kern-color-feedback-danger)",
      },
      muted: {
        DEFAULT: "var(--kern-color-layout-background-hued)",
        foreground: "var(--kern-color-layout-text-muted)",
      },
      accent: {
        DEFAULT: "var(--kern-color-action-default)",
        foreground: "var(--kern-color-action-on-default)",
      },
      popover: {
        DEFAULT: "var(--kern-color-layout-background-hued)",
        foreground: "var(--kern-color-layout-text-default)",
      },
      card: {
        DEFAULT: "var(--kern-color-form-input-background)",
        foreground: "var(--kern-color-layout-text-default)",
      },
      sidebar: {
        DEFAULT: "var(--kern-color-layout-background-hued)",
        foreground: "var(--kern-color-layout-text-default)",
        primary: "var(--kern-color-action-default)",
        "primary-foreground": "var(--kern-color-action-on-default)",
        accent: "var(--kern-color-action-default)",
        "accent-foreground": "var(--kern-color-action-on-default)",
        border: "var(--kern-color-form-input-border)",
        ring: "var(--kern-color-form-input-border)",
      },

      // styleguide bundesregierung
      font: "#222",
      bund: "#17406E",
      banner: "#e9df2e",
      deepblue: {
        50: "#383f6a",
        100: "#2e3560",
        200: "#242b56",
        300: "#1a214c",
        400: "#101742",
        500: "#060d38",
        600: "#00032e",
        700: "#000024",
        800: "#00001a",
        900: "#000010",
      },
      silver: "#85878b",
      lightning: {
        50: "#deffff",
        100: "#d4fff7",
        200: "#caffed",
        300: "#c0ffe3",
        400: "#b6ffd9",
        500: "#acfccf",
        600: "#a2f2c5",
        700: "#98e8bb",
        800: "#8edeb1",
        900: "#84d4a7",
      },
      blau: {
        20: "#CCE4F0",
        40: "#99C9E2",
        60: "#66ADD3",
        80: "#3392C5",
        100: "#0077B6",
      },
      textblack: "#111314",
      dunkelblau: {
        20: "#CCDBE4",
        40: "#99B7C8",
        60: "#6693AD",
        80: "#336F91",
        100: "#004B76",
      },
      dunkelgrau: {
        20: "#DDDFE0",
        40: "#BCC0C1",
        60: "#9AA0A2",
        80: "#798183",
        100: "#576164",
      },
      hellgrau: {
        20: "#F2F3F4",
        40: "#E5E8E9",
        60: "#D8DCDF",
        80: "#CBD1D4",
        100: "#BEC5C9",
      },
      dunkelgruen: {
        20: "#CCDEDA",
        40: "#99BEB5",
        60: "#669D8F",
        80: "#337D6A",
        100: "#005C45",
      },

      gruen: {
        20: "#CCE7DB",
        40: "#99CEB7",
        60: "#66B692",
        80: "339D6E",
        100: "#00854A",
      },
      hellorange: {
        20: "#FDF1D8",
        40: "#FCE4B1",
        60: "#FAD68B",
        80: "#F9C964",
        100: "#F7BB3D",
      },
      rot: {
        20: "#F2CCD8",
        40: "#E699B1",
        60: "#D9668A",
        80: "#CD3363",
        100: "#C0003C",
      },
      dunkelrot: {
        20: "#933F57",
        40: "#933F57",
        60: "#933F57",
        80: "#933F57",
        100: "#780F2D",
      },
      violett: {
        20: "#DFD6DE",
        40: "#BFADBC",
        60: "#9F839B",
        80: "#7F5A79",
        100: "#5F316E",
      },
      orange: {
        20: "#F5DCD7",
        40: "#EBB9AF",
        60: "#E19688",
        80: "#D77360",
        100: "#CD5038",
      },
      gelb: {
        20: "#FEF9D8",
        40: "#FDF3B0",
        60: "#FBEC89",
        80: "#FAE661",
        100: "#F9E03A",
      },
      hellgruen: {
        20: "#F3F4D6",
        40: "#E6EAAD",
        60: "#DADF83",
        80: "#CDD55A",
        100: "#C1CA31",
      },
      oliv: {
        20: "#9BB088",
        40: "#9BB088",
        60: "#9BB088",
        80: "#7A9661",
        100: "#597C39",
      },
      tuerkis: {
        20: "#CCE6E8",
        40: "#99CDD1",
        60: "#66B3B9",
        80: "#339AA2",
        100: "#00818B",
      },
      hellblau: {
        20: "#E6F5FB",
        40: "#CCEBF7",
        60: "#B3E1F4",
        80: "#99D7F0",
        100: "#80CDEC",
      },
    },
    borderRadius: {
      lg: "var(--kern-metric-border-radius-large)",
      md: "var(--kern-metric-border-radius-default)",
      sm: "var(--kern-metric-border-radius-small)",
      full: "100%",
    },
  },
};
