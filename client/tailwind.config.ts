/** @type {import('tailwindcss').Config} */

import path from 'path';
import type { Config } from 'tailwindcss';
// import colors from 'tailwindcss/colors';
import { mtConfig } from "@material-tailwind/react";

const config: Config = {
  content: [
    path.resolve(__dirname, "./src/**/*.{html,js,ts,jsx,tsx}"),
    path.resolve(__dirname, '../node_modules/@tremor/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, '../node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}'),
    path.resolve(__dirname, '../node_modules/@ymwc/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/forms'),
    mtConfig
  ],
};

export default config;