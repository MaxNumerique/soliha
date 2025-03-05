import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      "light", 
      "dark", 
      "emerald",
      {
        "soliha-theme": {
        primary: "#00618a",
        seconday: "#d7d3c4",
        accent: "#a1d7e4",
        neutral: "#3d4451",
        "base-100": "#1f2937",
        info: "#a1d7e4",
        success: "#c8e1bc",
        warning: "#fef5ad",
        error: "#ed6f5d",
        },
      },
    ],
  },
} satisfies Config;