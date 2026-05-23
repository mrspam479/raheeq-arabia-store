import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette (semantic)
        emerald: '#0F4D3D',
        'emerald-light': '#34C48C',
        saffron: '#B98A3A',
        ivory: '#FBF3E7',
        charcoal: '#2F241D',
        // CSS-variable aliases
        'brand-primary': 'var(--brand-primary)',
        'brand-primary-dark': 'var(--brand-primary-dark)',
        'brand-primary-light': 'var(--brand-primary-light)',
        'brand-accent': 'var(--brand-accent)',
        'brand-accent-light': 'var(--brand-accent-light)',
        'brand-accent-dark': 'var(--brand-accent-dark)',
        cream: 'var(--bg-cream)',
        sand: 'var(--bg-sand)',
        card: 'var(--bg-card)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted: 'var(--muted)',
        success: 'var(--success)',
        error: 'var(--error)',
        info: 'var(--info)',
      },
      fontFamily: {
        tajawal: ['var(--font-tajawal)', 'system-ui', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
    },
  },
  plugins: [],
};

export default config;
