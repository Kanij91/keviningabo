const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
        secondary: "4px",
        container: "8px",
      },
      boxShadow: {
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.08)",
        hover: "0 4px 6px rgba(0, 0, 0, 0.1)",
        card: "0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      colors: {
        // Institutional reddish-maroon palette (primary brand color)
        primary: {
          50: "#FCE8E8",
          100: "#F9D1D1",
          200: "#F3A3A3",
          300: "#ED7575",
          400: "#E74747",
          DEFAULT: "#C02026", // Primary institutional reddish-maroon
          600: "#9A1A1E",
          700: "#741316",
          800: "#4E0D0F",
          900: "#280607",
          hover: "#A81B20",
        },
        // Accent color for primary action buttons (cyan/light blue)
        accent: {
          50: "#E6F9FC",
          100: "#CCF3F9",
          200: "#99E7F3",
          300: "#66DBED",
          400: "#33CFE7",
          DEFAULT: "#1ED6F3", // Bright cyan for primary buttons
          600: "#18ABBF",
          700: "#12808C",
          800: "#0C5659",
          900: "#062B2D",
          hover: "#0BC4E0",
        },
        // Neutral grays
        secondary: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          DEFAULT: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          hover: "#4B5563",
        },
        // Background colors
        background: {
          DEFAULT: "#F8F9FA",
          secondary: "#FFFFFF",
          tertiary: "#F3F4F6",
        },
        // Border colors
        border: {
          DEFAULT: "#E5E7EB",
          secondary: "#D1D5DB",
          focus: "#C02026",
        },
        // Status colors - subtle and professional
        status: {
          new: {
            bg: "#FCE8E8",
            text: "#C02026",
            border: "#F9D1D1",
          },
          assigned: {
            bg: "#F3E8FF",
            text: "#6B21A8",
            border: "#E9D5FF",
          },
          "in-progress": {
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FDE68A",
          },
          "on-hold": {
            bg: "#FED7AA",
            text: "#9A3412",
            border: "#FDBA74",
          },
          resolved: {
            bg: "#D1FAE5",
            text: "#065F46",
            border: "#A7F3D0",
          },
          closed: {
            bg: "#F3F4F6",
            text: "#374151",
            border: "#E5E7EB",
          },
        },
        // Priority colors
        priority: {
          critical: {
            bg: "#FEE2E2",
            text: "#991B1B",
            border: "#FECACA",
          },
          high: {
            bg: "#FED7AA",
            text: "#9A3412",
            border: "#FDBA74",
          },
          medium: {
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FDE68A",
          },
          low: {
            bg: "#D1FAE5",
            text: "#065F46",
            border: "#A7F3D0",
          },
        },
      },
      spacing: {
        "form-field": "12px",
        section: "24px",
      },
    },
  },
};
