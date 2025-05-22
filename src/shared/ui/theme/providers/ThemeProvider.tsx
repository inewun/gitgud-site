'use client';

import { useEffect } from 'react';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

import type { ThemeProviderProps as NextThemeProviderProps } from 'next-themes/dist/types';

export type ThemeProviderProps = NextThemeProviderProps;

/**
 * Единый провайдер темы для всего приложения.
 * Обертка над next-themes с дополнительной обработкой.
 *
 * @param {ThemeProviderProps} props - Свойства провайдера темы
 * @returns {JSX.Element} Компонент-провайдер темы
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Оптимизация темы после полной загрузки страницы
  useEffect(() => {
    // Удаляем класс для блокировки анимаций при первичной загрузке
    const removeInitClass = () => {
      if (document.documentElement.classList.contains('theme-init')) {
        document.documentElement.classList.remove('theme-init');
        document.documentElement.classList.add('theme-transition');
      }
    };

    if (document.readyState === 'complete') {
      removeInitClass();
    } else {
      window.addEventListener('load', removeInitClass);
      return () => {
        window.removeEventListener('load', removeInitClass);
      };
    }
  }, []);

  return <NextThemeProvider {...props} enableSystem={false}>{children}</NextThemeProvider>;
}
