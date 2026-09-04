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
        mgu: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0055a5',
          600: '#004080',
          700: '#002f60',
          800: '#002042',
          900: '#001328',
        }
      }
    },
  },
  plugins: [],
};
export default config;
