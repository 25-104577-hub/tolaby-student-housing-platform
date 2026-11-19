import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171310",
        paper: "#FAF6EF",
        brand: {
          DEFAULT: "#2F6F5E",
          deep: "#1F4B3F",
          light: "#E4F0EA",
        },
        clay: "#B5754B",
        warn: "#B3462C",
      },
      fontFamily: {
        display: ["var(--font-cairo)", "sans-serif"],
        body: ["var(--font-tajawal)", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
