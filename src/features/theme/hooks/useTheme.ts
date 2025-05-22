import { useCallback, useState, useEffect } from 'react';

import { useTheme as useNextTheme } from 'next-themes';
import type { Theme } from '../types';

/**
 * Хук для работы с темой
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Предотвращаем несовпадение клиент/сервер, дожидаемся монтирования
  useEffect(() => {
    setMounted(true);
  }, []);

  // Определяем текущую тему после монтирования компонента
  const currentTheme = mounted ? resolvedTheme || theme || 'light' : 'light';

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDarkTheme: currentTheme === 'dark',
    isLightTheme: currentTheme === 'light',
    mounted,
    isChanging,
  };
}
