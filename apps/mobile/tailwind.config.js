/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4338ca",
        },
        surface: {
          DEFAULT: "#ffffff",
          alt: "#f8fafc",
          elevated: "#ffffff",
        },
        primary: "#0f172a",
        secondary: "#64748b",
        tertiary: "#94a3b8",
        inverse: "#ffffff",
        default: "#e2e8f0",
        strong: "#cbd5e1",
        status: {
          draft: "#94a3b8",
          published: "#22c55e",
          paused: "#f59e0b",
          "under-review": "#f97316",
          removed: "#ef4444",
          requested: "#6366f1",
          accepted: "#22c55e",
          declined: "#ef4444",
          completed: "#0ea5e9",
          cancelled: "#94a3b8",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#0ea5e9",
        star: "#fbbf24",
      },
      spacing: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
