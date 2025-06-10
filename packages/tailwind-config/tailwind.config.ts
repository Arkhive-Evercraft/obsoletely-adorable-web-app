import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        // Vaporwave/Retro palette
        vapor: {
          pink: "#ff7eb3",
          purple: "#a855f7",
          blue: "#06b6d4",
          cyan: "#67e8f9",
          mint: "#6ee7b7",
          peach: "#fbbf24",
          lavender: "#c4b5fd",
          coral: "#fb7185",
        },
        retro: {
          dark: "#1a1a2e",
          darker: "#16213e",
          medium: "#0f3460",
          light: "#e94560",
          accent: "#f39c12",
          green: "#00ff41",
          amber: "#ffb347",
        },
        gui: {
          gray: "#c0c0c0",
          darkGray: "#808080",
          lightGray: "#e0e0e0",
          blue: "#0080ff",
          darkBlue: "#000080",
        },
      },
      fontFamily: {
        pixel: ["Courier New", "monospace"],
        retro: ["Monaco", "Menlo", "Ubuntu Mono", "monospace"],
      },
      backgroundImage: {
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
        "retro-grid":
          "linear-gradient(rgba(255, 126, 179, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 126, 179, 0.1) 1px, transparent 1px)",
        "vapor-gradient":
          "linear-gradient(45deg, #ff7eb3, #a855f7, #06b6d4, #67e8f9)",
        "gui-inset":
          "linear-gradient(135deg, #808080 0%, #c0c0c0 50%, #e0e0e0 100%)",
        "gui-raised":
          "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 50%, #808080 100%)",
      },
      boxShadow: {
        retro: "4px 4px 0px rgba(0, 0, 0, 0.3)",
        "retro-inset":
          "inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.5)",
        "gui-raised":
          "1px 1px 0px #ffffff, 2px 2px 0px #808080, 3px 3px 0px #404040",
        "gui-inset":
          "inset 1px 1px 0px #808080, inset 2px 2px 0px #404040",
        neon:
          "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        scan: "scan 2s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { textShadow: "0 0 5px currentColor" },
          "100%": {
            textShadow:
              "0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
