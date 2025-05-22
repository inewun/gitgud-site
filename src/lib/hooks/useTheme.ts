'use client';

import { useEffect, useState } from 'react';

import { useTheme as useNextTheme } from 'next-themes';

export type Theme = 'dark' | 'light';

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

  // При изменении темы, обновляем data-theme и class атрибуты для HTML элемента
  useEffect(() => {
    if (!mounted) return;

    // Устанавливаем флаг изменения темы
    setIsChanging(true);

    // Применяем класс dark для поддержки tailwind dark:
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Сбрасываем флаг после завершения анимации
    const timer = setTimeout(() => {
      setIsChanging(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [currentTheme, mounted]);

  const toggleTheme = () => {
    // Предотвращаем двойное переключение во время анимации
    if (isChanging) return;

    // Добавляем класс для анимации при изменении темы
    document.documentElement.classList.add('theme-transition');

    // Убираем класс после завершения анимации
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 1000);

    // Переключаем тему
    if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDarkTheme: currentTheme === 'dark',
    isLightTheme: currentTheme === 'light',
    mounted, // Позволяет проверить, смонтирован ли компонент
    isChanging, // Показывает, что тема в процессе изменения
  };
}
