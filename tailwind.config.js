module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '320px', // Extra small screens (iPhone SE, etc.)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#000000',
        'secondary': '#ffffff',
      },
      animation: {
        'text-shrink': 'textShrink 1.5s ease-in-out',
        'text-expand': 'textExpand 1.5s ease-in-out',
      },
      keyframes: {
        textShrink: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.5)', opacity: 0.7 },
          '100%': { transform: 'scale(0.3)', opacity: 0.5 },
        },
        textExpand: {
          '0%': { transform: 'scale(0.3)', opacity: 0.5 },
          '50%': { transform: 'scale(0.5)', opacity: 0.7 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};