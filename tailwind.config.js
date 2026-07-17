/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#6E1423',
          deep: '#450B16',
          light: '#8B1F32',
        },
        saffron: {
          DEFAULT: '#E8821C',
          light: '#F3A24E',
        },
        gold: {
          DEFAULT: '#C0973B',
          light: '#D6B667',
          deep: '#8F6D26',
        },
        cream: {
          DEFAULT: '#FBF1DD',
          deep: '#F4E3BE',
          paper: '#FFFAF0',
        },
        ink: {
          DEFAULT: '#3A2417',
          light: '#5A4433',
        },
        stone: {
          DEFAULT: '#8A7360',
          light: '#B4A38E',
        },
      },
      fontFamily: {
        display: ['Eczar', 'serif'],
        body: ['Hind', 'sans-serif'],
        ledger: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(1.4) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(0.96) rotate(-2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-3deg)', opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        stamp: 'stamp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        rise: 'rise 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
