import type { Config } from "tailwindcss";

const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        neon: "0 0 5px theme('colors.purple.200'), 0 0 60px theme('colors.purple.700')",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#a620ff",
              light: "#daa3ff",
              dark: "#9e27ef",
            },
            secondary: {
              DEFAULT: "#fff",
              light: "#fff",
              dark: "#fff",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#a620ff",
              light: "#daa3ff",
              dark: "#9e27ef",
            },
            secondary: {
              DEFAULT: "#fff",
              light: "#fff",
              dark: "#fff",
            },
          },
        },
      },
    }),
  ],
};
export default config;
