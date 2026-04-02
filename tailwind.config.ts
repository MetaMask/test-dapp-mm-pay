import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        pay: {
          page: {
            from: 'hsl(var(--pay-page-from) / <alpha-value>)',
            via: 'hsl(var(--pay-page-via) / <alpha-value>)',
            to: 'hsl(var(--pay-page-to) / <alpha-value>)',
          },
          surface: {
            DEFAULT: 'hsl(var(--pay-surface) / <alpha-value>)',
            muted: 'hsl(var(--pay-surface-muted) / <alpha-value>)',
          },
          border: {
            DEFAULT: 'hsl(var(--pay-border) / <alpha-value>)',
            strong: 'hsl(var(--pay-border-strong) / <alpha-value>)',
          },
          fg: {
            DEFAULT: 'hsl(var(--pay-foreground) / <alpha-value>)',
            muted: 'hsl(var(--pay-muted) / <alpha-value>)',
            subtle: 'hsl(var(--pay-subtle) / <alpha-value>)',
            section: 'hsl(var(--pay-section-label) / <alpha-value>)',
            accent: 'hsl(var(--pay-accent) / <alpha-value>)',
          },
          accent: {
            DEFAULT: 'hsl(var(--pay-accent-border) / <alpha-value>)',
          },
          ring: 'hsl(var(--pay-ring) / <alpha-value>)',
          code: {
            bg: 'hsl(var(--pay-code-bg) / <alpha-value>)',
            border: 'hsl(var(--pay-code-border) / <alpha-value>)',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
