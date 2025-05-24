'use client';

import React, { useEffect } from 'react';

import { AnimatePresence } from 'framer-motion';

import { ThemeToggle as SharedThemeToggle } from '@/shared/ui/feedback/theme-toggle';

import { useThemeControl } from '../model/useThemeControl';

import { ThemeDropdownMenu } from './components';

/**
 * Компонент переключения темы.
 * Обеспечивает интерфейс для выбора темы (светлая, темная, системная).
 * Вся бизнес-логика теперь вынесена в хук useThemeControl.
 *
 * @deprecated Используйте ThemeToggle из @/shared/ui/feedback/theme-toggle
 */
export function ThemeToggle() {
  const {
    mounted,
    isOpen,
    currentTheme,
    currentThemeObj,
    themes,
    toggleMenu,
    selectTheme,
    dropdownRef,
    menuItemsRef,
  } = useThemeControl();

  // Сбрасываем состояние меню при размонтировании компонента
  useEffect(() => {
    return () => {
      menuItemsRef.current = [];
    };
  }, [menuItemsRef]);

  // Не отображаем ничего до монтирования компонента для предотвращения гидрационных ошибок
  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <SharedThemeToggle className="w-9 h-9" />

      <AnimatePresence mode="wait" onExitComplete={() => (menuItemsRef.current = [])}>
        {isOpen && (
          <ThemeDropdownMenu
            themes={themes}
            currentTheme={currentTheme}
            onSelect={selectTheme}
            ref={menuItemsRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
