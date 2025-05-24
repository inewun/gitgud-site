'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ThemeMode } from './constants';

import type { LucideIcon } from 'lucide-react';

/**
 * Тип данных для темы в выпадающем меню
 */
export interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: LucideIcon;
}

/**
 * Массив доступных тем
 */
export const themes: ThemeOption[] = [
  { value: ThemeMode.LIGHT, label: 'Светлая', icon: Sun },
  { value: ThemeMode.DARK, label: 'Тёмная', icon: Moon },
];

/**
 * Хук для управления темой с отделенной от UI логикой
 * Включает в себя:
 * - Контроль открытия/закрытия выпадающего меню
 * - Определение текущей темы и иконки
 * - Управление клавиатурной навигацией
 * - Обработка щелчка за пределами компонента
 */
export function useThemeControl() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Гарантируем рендеринг только на клиенте
  useEffect(() => {
    setMounted(true);
  }, []);

  // Определяем текущую тему и иконку
  const currentTheme = resolvedTheme as ThemeMode;
  const currentThemeObj = themes.find(t => t.value === currentTheme) || themes[0];

  // Обработчик открытия/закрытия меню
  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  }, []);

  // Обработчик выбора темы с анимацией перехода
  const selectTheme = useCallback(
    (selectedTheme: ThemeMode) => {
      // Добавляем класс для анимации перехода
      document.documentElement.classList.add('theme-transition');

      // Устанавливаем тему через next-themes
      setTheme(selectedTheme);

      // Сохраняем в localStorage для персистентности
      localStorage.setItem('theme', selectedTheme);

      // Закрываем меню
      setIsOpen(false);

      // Убираем класс анимации после завершения перехода
      const transitionTimeout = setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300); // 300ms = var(--duration-slow)

      return () => {
        clearTimeout(transitionTimeout);
      };
    },
    [setTheme],
  );

  // Обработчик клика вне компонента
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  // Обработчик нажатия клавиш для навигации по меню
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      const menuItems = menuItemsRef.current.filter(Boolean);
      const currentIndex = menuItems.findIndex(item => item === document.activeElement);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          menuItems[nextIndex]?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex]?.focus();
          break;
        }
        case 'Escape': {
          e.preventDefault();
          setIsOpen(false);
          break;
        }
        case 'Enter':
        case ' ': {
          if (
            document.activeElement &&
            menuItems.includes(document.activeElement as HTMLButtonElement)
          ) {
            e.preventDefault();
            const activeIndex = menuItems.findIndex(item => item === document.activeElement);
            if (activeIndex >= 0 && activeIndex < themes.length) {
              selectTheme(themes[activeIndex].value);
            }
          }
          break;
        }
        default:
          break;
      }
    },
    [isOpen, selectTheme],
  );

  // Добавляем/удаляем обработчики событий
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClickOutside, handleKeyDown]);

  return {
    mounted,
    isOpen,
    currentTheme,
    currentThemeObj,
    themes,
    toggleMenu,
    selectTheme,
    dropdownRef,
    menuItemsRef,
  };
}
