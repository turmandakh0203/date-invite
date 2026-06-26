import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        ink:    "#1E293B",
        "ink-m":"#475569",
        "ink-s":"#94A3B8",
      },
      animation: {
        floatUp:     "floatUp linear infinite",
        emojiFloat:  "emojiFloat 3s ease-in-out infinite",
        screenIn:    "screenIn .45s cubic-bezier(.34,1.56,.64,1) both",
        confetti:    "confetti .6s cubic-bezier(.34,1.56,.64,1)",
        borderShimmer:"borderShimmer 4s ease infinite",
      },
      keyframes: {
        floatUp: {
          "0%":   { opacity: "0", transform: "translateY(0) rotate(0deg) scale(.6)" },
          "10%":  { opacity: ".55" },
          "90%":  { opacity: ".3" },
          "100%": { opacity: "0", transform: "translateY(-110vh) rotate(360deg) scale(1.1)" },
        },
        emojiFloat: {
          "0%,100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%":     { transform: "translateY(-8px) rotate(3deg)" },
        },
        screenIn: {
          from: { opacity: "0", transform: "translateY(24px) scale(.96)" },
          to:   { opacity: "1", transform: "none" },
        },
        confetti: {
          from: { transform: "scale(0) rotate(-10deg)" },
          to:   { transform: "none" },
        },
        borderShimmer: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%":     { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
