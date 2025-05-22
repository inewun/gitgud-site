import tailwindForms from '@tailwindcss/forms';
import { fontFamily } from 'tailwindcss/defaultTheme';

import { breakpoints } from './src/styles/breakpoints';

import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

// Динамический генератор safelist на основе используемых классов
const generateSafelist = (): string[] => {
  // Базовые классы, которые должны быть включены в safelist
  const baseClasses: string[] = [];

  // Важные классы для компонентов
  const backgroundVariants = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-error',
    'bg-warning',
    'bg-info',
  ];
  const opacityVariants = ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90'];

  // Генерация классов bg-{color}/{opacity}
  const bgOpacityClasses = backgroundVariants.flatMap(bg =>
    opacityVariants.map(opacity => `${bg}/${opacity}`),
  );

  // Текстовые классы для компонентов
  const textClasses = [
    'text-primary',
    'text-secondary',
    'text-success',
    'text-error',
    'text-warning',
    'text-info',
  ];

  // Классы для состояний
  const stateClasses = [
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'backdrop-blur-sm',
    'backdrop-blur-md',
    'backdrop-blur-lg',
    'animate-fadeIn',
    'animate-fadeUp',
    'animate-slideIn',
    'animate-pulse',
  ];

  // Объединяем все классы
  return [
    ...baseClasses,
    ...backgroundVariants,
    ...bgOpacityClasses,
    ...textClasses,
    ...stateClasses,
  ];
};

const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: generateSafelist(),
  theme: {
    screens: {
      xs: breakpoints.xs,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
      '2xl': breakpoints['2xl'],
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Manrope', 'var(--font-inter)', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Типографская шкала с переменными для лучшей отзывчивости
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-xs)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-sm)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-base)' }],
        md: ['var(--font-size-md)', { lineHeight: 'var(--line-height-md)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-lg)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-xl)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-2xl)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-3xl)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-4xl)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-5xl)' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-6xl)' }],
        '7xl': ['var(--font-size-7xl)', { lineHeight: 'var(--line-height-7xl)' }],
        '8xl': ['var(--font-size-8xl)', { lineHeight: 'var(--line-height-8xl)' }],
        '9xl': ['var(--font-size-9xl)', { lineHeight: 'var(--line-height-9xl)' }],
      },
      fontWeight: {
        thin: 'var(--font-weight-thin)',
        extralight: 'var(--font-weight-extralight)',
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
        black: 'var(--font-weight-black)',
      },
      letterSpacing: {
        tighter: 'var(--letter-spacing-tighter)',
        tight: 'var(--letter-spacing-tight)',
        normal: 'var(--letter-spacing-normal)',
        wide: 'var(--letter-spacing-wide)',
        wider: 'var(--letter-spacing-wider)',
        widest: 'var(--letter-spacing-widest)',
      },
      colors: {
        // 2025: Современная минималистичная палитра
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          active: 'rgb(var(--primary-active) / <alpha-value>)',
          foreground: 'rgb(var(--on-primary) / <alpha-value>)',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        // 2025: Более тонкие, изящные тени
        sm: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        DEFAULT: '0 3px 8px -1px rgba(15, 23, 42, 0.08)',
        md: '0 6px 16px -2px rgba(15, 23, 42, 0.08), 0 2px 5px -1px rgba(15, 23, 42, 0.04)',
        lg: '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        xl: '0 18px 35px -5px rgba(15, 23, 42, 0.08), 0 6px 12px -3px rgba(15, 23, 42, 0.04)',
        '2xl': '0 25px 50px -8px rgba(15, 23, 42, 0.12)',
        inner: 'inset 0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        none: 'none',
      },
      blur: {
        xs: 'var(--blur-sm)',
        sm: 'var(--blur-sm)',
        md: 'var(--blur-md)',
        lg: 'var(--blur-lg)',
        xl: '48px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s var(--ease-out-expo) forwards',
        'fade-up': 'fadeUp 0.5s var(--ease-out-expo) forwards',
        'slide-left': 'slideLeft 0.5s var(--ease-out-expo) forwards',
        'slide-right': 'slideRight 0.5s var(--ease-out-expo) forwards',
        'scale-up': 'scaleUp 0.5s var(--soft-spring) forwards',
        pulse: 'pulse 1.5s var(--ease-in-out) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'soft-spring': 'var(--soft-spring)',
        'out-expo': 'var(--ease-out-expo)',
      },
      typography: {
        // Улучшенная типографика 2025
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: 'rgb(var(--foreground))',
            h1: {
              color: 'rgb(var(--foreground))',
              fontWeight: 'var(--font-weight-extrabold)',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: 'rgb(var(--foreground))',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.025em',
            },
            h3: {
              color: 'rgb(var(--foreground))',
              fontWeight: 'var(--font-weight-semibold)',
              letterSpacing: '-0.025em',
            },
            h4: {
              color: 'rgb(var(--foreground))',
              fontWeight: 'var(--font-weight-semibold)',
            },
            strong: {
              color: 'rgb(var(--foreground))',
              fontWeight: 'var(--font-weight-semibold)',
            },
            a: {
              color: 'rgb(var(--primary))',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)',
              '&:hover': {
                color: 'rgb(var(--primary-hover))',
              },
            },
            code: {
              backgroundColor: 'rgb(var(--subtle))',
              padding: '0.2em 0.4em',
              borderRadius: 'var(--radius-sm)',
              color: 'rgb(var(--foreground))',
              fontFamily: 'JetBrains Mono, monospace',
            },
            pre: {
              backgroundColor: 'rgb(var(--subtle))',
              color: 'rgb(var(--foreground))',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
            },
          },
        },
      },
    },
  },
  plugins: [
    tailwindForms,
    // Добавление утилит для различных вариантов
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        // 2025: Минималистичные паттерны
        '.bg-dot-pattern-light': {
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
        },
        '.bg-dot-pattern-dark': {
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
        },
        '.bg-mesh-light': {
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        },
        '.bg-mesh-dark': {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        },
        // 2025: Эффекты нового поколения
        '.card-hover': {
          transition: 'transform 0.3s var(--soft-spring), box-shadow 0.3s var(--ease-out)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 20px -5px rgba(15, 23, 42, 0.08)',
          },
        },
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-pretty': {
          textWrap: 'pretty',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

export default config;
