/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"Silkscreen"', 'monospace'],
        sub: ['"VT323"', 'monospace'],
      },
      colors: {
        spidey: {
          crimson: '#e11d48',
          red: '#dc2626',
          dark: '#991b1b',
          glow: '#fb7185',
        },
        midnight: {
          950: '#050710',
          900: '#0a0e1a',
          800: '#12182b',
          700: '#1b243b',
          600: '#283556',
        },
        arcade: {
          gold: '#facc15',
          amber: '#f59e0b',
          dark: '#b45309',
        },
        pixel: {
          border: '#334155',
          light: '#f8fafc',
          muted: '#94a3b8',
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #020617',
        'pixel-sm': '2px 2px 0px 0px #020617',
        'pixel-gold': '4px 4px 0px 0px #b45309',
        'pixel-crimson': '4px 4px 0px 0px #7f1d1d',
      },
    },
  },
  plugins: [],
}
