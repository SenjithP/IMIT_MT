/** @type {import('tailwindcss').Config} */
import scrollbarPlugin from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        move: {
          '0%, 100%': { transform: 'translateX(-20px)' },
          '50%': { transform: 'translateX(20px)' },
        }
      },
      animation: {
        move: 'move 1s infinite alternate',
      },
    },
  },
  plugins: [scrollbarPlugin()],
};
