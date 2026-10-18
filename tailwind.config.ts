import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        anchor: {
          dark: "#090D16",
          card: "#111827",
          border: "#1F2937",
          surface: "#1A2234",
          emerald: "#10B981",
          emeraldGlow: "#059669",
          amber: "#F59E0B",
          amberGlow: "#D97706",
          coral: "#F43F5E",
          coralGlow: "#E11D48",
          blue: "#38BDF8",
          indigo: "#6366F1",
          purple: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(244, 63, 94, 0.4), 0 0 30px rgba(244, 63, 94, 0.2)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(244, 63, 94, 0.8), 0 0 50px rgba(244, 63, 94, 0.4)",
            transform: "scale(1.04)",
          },
        },
        breathe: {
          "0%, 100%": { transform: "scale(0.85)", opacity: "0.7" },
          "25%": { transform: "scale(1.25)", opacity: "1" },
          "50%": { transform: "scale(1.25)", opacity: "0.95" },
          "75%": { transform: "scale(0.85)", opacity: "0.7" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.5s infinite ease-in-out",
        breathe: "breathe 16s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
