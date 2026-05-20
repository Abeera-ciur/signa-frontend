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
        bg: "#0a0a0f",
        panel: "#111118",
        border: "#1e293b",
        text: "#e2e8f0",
        muted: "#64748b",
        neonG: "#22c55e",
        neonR: "#ef4444",
        neonY: "#fbbf24"
      },
      boxShadow: {
        "neon-g": "0 0 12px rgba(34,197,94,0.4), inset 0 0 6px rgba(34,197,94,0.15)",
        "neon-r": "0 0 12px rgba(239,68,68,0.4), inset 0 0 6px rgba(239,68,68,0.15)"
      }
    },
  },
  plugins: [],
};
export default config;