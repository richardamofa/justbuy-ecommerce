/**
 * Shared design-system tokens for the storefront and admin panel.
 *
 * Shared neutral storefront and admin tokens. Keep the accent restrained so
 * the product imagery remains the strongest visual signal.
 */
export default {
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#171717",
          50: "#F5F5F4",
          100: "#E7E5E2",
          200: "#D4D1CC",
          300: "#9A9A9A",
          400: "#858585",
          500: "#6B6B6B",
          600: "#4A4A4A",
          700: "#303030",
          800: "#202020",
          900: "#171717",
        },
        paper: {
          DEFAULT: "#FAFAF8",
          50: "#FFFFFF",
          100: "#FAFAF8",
          200: "#FAFAF8",
          300: "#F1F0ED",
          400: "#E7E5E2",
        },
        moss: {
          DEFAULT: "#1F3A36",
          50: "#EEF3F1",
          100: "#D9E5E1",
          200: "#B3CBC4",
          300: "#82A69C",
          400: "#507C70",
          500: "#1F3A36",
          600: "#172D2A",
          700: "#172D2A",
          800: "#10221F",
          900: "#0C1715",
        },
        signal: {
          DEFAULT: "#B94A48",
          50: "#FBEDEC",
          100: "#F0C9C7",
        },
      },
      fontFamily: {
        display: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["3.75rem", { lineHeight: "1.05" }],
        "display-lg": ["2.75rem", { lineHeight: "1.1" }],
        "display-md": ["2rem", { lineHeight: "1.15" }],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(21, 23, 27, 0.06)",
        raised: "0 4px 16px rgba(21, 23, 27, 0.08)",
      },
      borderRadius: {
        sm: "5px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
};
