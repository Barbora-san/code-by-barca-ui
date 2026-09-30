/**
 * Tailwind preset – stejné tokeny jako styles.css, aby šlo v projektech
 * s Tailwindem psát `bg-cbb-surface`, `text-cbb-accent`, `rounded-cbb-lg` atd.
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require("code-by-barca-ui/tailwind-preset")],
 *     content: ["./src/**\/*.{js,jsx,ts,tsx}"],
 *   };
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        cbb: {
          bg: "var(--cbb-bg)",
          "bg-alt": "var(--cbb-bg-alt)",
          surface: "var(--cbb-surface)",
          "surface-2": "var(--cbb-surface-2)",
          border: "var(--cbb-border)",
          "border-strong": "var(--cbb-border-strong)",
          text: "var(--cbb-text)",
          muted: "var(--cbb-text-muted)",
          subtle: "var(--cbb-text-subtle)",
          accent: "var(--cbb-accent)",
          "accent-hover": "var(--cbb-accent-hover)",
          success: "var(--cbb-success)",
          danger: "var(--cbb-danger)",
          info: "var(--cbb-info)",
        },
      },
      borderRadius: {
        "cbb-sm": "var(--cbb-radius-sm)",
        "cbb-md": "var(--cbb-radius-md)",
        "cbb-lg": "var(--cbb-radius-lg)",
      },
      fontFamily: {
        "cbb-sans": "var(--cbb-font-sans)",
        "cbb-mono": "var(--cbb-font-mono)",
      },
      boxShadow: {
        "cbb-glow": "var(--cbb-glow)",
      },
    },
  },
};
