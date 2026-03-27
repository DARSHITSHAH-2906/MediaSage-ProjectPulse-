import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        "outline": "#908fa0",
        "on-secondary-fixed": "#191a2e",
        "inverse-surface": "#e3e0f1",
        "tertiary-container": "#d97721",
        "surface-dim": "#12121d",
        "surface": "#12121d",
        "surface-bright": "#383845",
        "secondary-fixed-dim": "#c5c4df",
        "on-surface-variant": "#c7c4d7",
        "surface-container-high": "#292935",
        "primary-fixed": "#e1e0ff",
        "on-background": "#e3e0f1",
        "on-primary-fixed": "#07006c",
        "on-error-container": "#ffdad6",
        "tertiary": "#ffb783",
        "primary-fixed-dim": "#c0c1ff",
        "on-secondary-fixed-variant": "#44455b",
        "surface-variant": "#343440",
        "surface-container-low": "#1b1a26",
        "tertiary-fixed": "#ffdcc5",
        "surface-container": "#1f1e2a",
        "on-secondary": "#2e2f44",
        "error": "#ffb4ab",
        "secondary-container": "#47475e",
        "primary-container": "#8083ff",
        "surface-container-highest": "#343440",
        "on-primary-container": "#0d0096",
        "on-surface": "#e3e0f1",
        "on-primary": "#1000a9",
        "secondary": "#c5c4df",
        "on-tertiary": "#4f2500",
        "outline-variant": "#464554",
        "tertiary-fixed-dim": "#ffb783",
        "on-primary-fixed-variant": "#2f2ebe",
        "on-tertiary-fixed-variant": "#703700",
        "error-container": "#93000a",
        "secondary-fixed": "#e1e0fc",
        "surface-tint": "#c0c1ff",
        "surface-container-lowest": "#0d0d18",
        "inverse-primary": "#494bd6",
        "inverse-on-surface": "#302f3b",
        "primary": "#c0c1ff",
        "on-error": "#690005",
        "on-tertiary-fixed": "#301400",
        "on-secondary-container": "#b7b6d1",
        "on-tertiary-container": "#452000",
        "background": "#12121d",
        "bg": "#12121d"
      },
      letterSpacing: {
        display: '-0.04em',
        label: '0.05em',
      }
    },
  },
  plugins: [],
};

export default config;
