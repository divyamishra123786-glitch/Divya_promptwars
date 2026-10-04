/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#101214',
        secondary: '#191D20',
        card: '#22272A',
        accent: '#F2A36D',
        ivory: '#D8D0C2',
        sage: '#A5B5A1',
        warning: '#E6B86C',
        critical: '#DB8178',
        'text-primary': '#F5F1EB',
        muted: '#93999C',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      animation: {
        'eclipse-pulse': 'eclipse-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease forwards',
        'slide-up': 'slide-up 0.4s ease forwards',
      },
      keyframes: {
        'eclipse-pulse': {
          '0%, 100%': { boxShadow: '0 0 30px 8px rgba(242,163,109,0.3)' },
          '50%': { boxShadow: '0 0 60px 16px rgba(242,163,109,0.5)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
