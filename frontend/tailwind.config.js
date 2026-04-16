/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0F1E',
        card: '#111827',
        primary: '#00FF87',
        warning: '#FFB800',
        danger: '#FF4C4C',
        'text-primary': '#F9FAFB',
        'text-secondary': '#6B7280',
        'card-hover': '#1a2235',
        'border-subtle': '#1F2937',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(0,255,135,0.15)',
        'glow-warning': '0 0 20px rgba(255,184,0,0.15)',
        'glow-danger': '0 0 20px rgba(255,76,76,0.15)',
      },
    },
  },
  plugins: [],
};
