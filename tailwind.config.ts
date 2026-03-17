import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"]
      },
      colors: {
        db: {
          bg: "#fdfaf5",
          surface: "#ffffff",
          surfaceSoft: "#f6f0ff",
          border: "#e3d5ff",
          accent: "#ff8ba7",
          accentSoft: "#ffe3ec",
          accentStrong: "#ff4d6d",
          textMain: "#2b2b33",
          textMuted: "#6b6b7a"
        }
      }
    }
  },
  plugins: []
};

export default config;

