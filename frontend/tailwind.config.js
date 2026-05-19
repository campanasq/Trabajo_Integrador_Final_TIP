/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        brand: {
          50:  '#eff5ff',
          100: '#dbe7ff',
          200: '#bfd3ff',
          300: '#93b3ff',
          400: '#608aff',
          500: '#3b6dfb',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f1f5a',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        ink: {
          50:  '#f7f8fb',
          100: '#eef0f5',
          200: '#e0e4ec',
          300: '#c8cfdd',
          400: '#94a0b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#070b18',
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '22px',
      },
      boxShadow: {
        // layered, premium shadows — ambient + key light
        xs:   '0 1px 2px rgba(15,23,42,0.04)',
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.04)',
        card: '0 1px 2px rgba(15,23,42,0.03), 0 4px 16px -4px rgba(15,23,42,0.08)',
        'card-hover': '0 4px 8px -2px rgba(15,23,42,0.06), 0 16px 40px -8px rgba(15,23,42,0.14)',
        pop:  '0 8px 16px -4px rgba(15,23,42,0.08), 0 24px 48px -12px rgba(15,23,42,0.18)',
        glow: '0 0 0 1px rgba(37,99,235,0.18), 0 8px 24px -8px rgba(37,99,235,0.25)',
        'glow-soft': '0 0 0 4px rgba(37,99,235,0.10)',
        'glow-danger': '0 0 0 4px rgba(239,68,68,0.12)',
        'inner-soft': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'subtle-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        'ambient-glow': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 280ms cubic-bezier(0.16,1,0.3,1) both',
        'slide-up': 'slide-up 320ms cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.6s infinite',
        'subtle-pulse': 'subtle-pulse 2.4s ease-in-out infinite',
        'ambient-glow': 'ambient-glow 4s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-light':
          "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
        'grid-dark':
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        'sheen': 'linear-gradient(180deg, rgba(255,255,255,0.6), transparent 30%)',
        'sheen-dark': 'linear-gradient(180deg, rgba(255,255,255,0.04), transparent 30%)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};
