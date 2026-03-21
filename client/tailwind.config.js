/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50: "hsl(222, 100%, 96%)",
          100: "hsl(222, 100%, 92%)",
          200: "hsl(222, 100%, 84%)",
          300: "hsl(222, 100%, 72%)",
          400: "hsl(222, 96%, 60%)",
          500: "hsl(222, 92%, 52%)",
          600: "hsl(222, 88%, 44%)",
          700: "hsl(222, 84%, 36%)",
          800: "hsl(222, 80%, 28%)",
          900: "hsl(222, 76%, 20%)",
        },
        surface: {
          900: "hsl(220, 20%, 8%)",
          800: "hsl(220, 18%, 12%)",
          700: "hsl(220, 16%, 16%)",
          600: "hsl(220, 14%, 20%)",
          500: "hsl(220, 12%, 26%)",
        },
        severity: {
          critical: "hsl(0, 86%, 57%)",
          "critical-bg": "hsl(0, 86%, 12%)",
          "critical-border": "hsl(0, 86%, 28%)",
          warning: "hsl(38, 95%, 54%)",
          "warning-bg": "hsl(38, 95%, 10%)",
          "warning-border": "hsl(38, 95%, 26%)",
          info: "hsl(200, 88%, 52%)",
          "info-bg": "hsl(200, 88%, 10%)",
          "info-border": "hsl(200, 88%, 26%)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
