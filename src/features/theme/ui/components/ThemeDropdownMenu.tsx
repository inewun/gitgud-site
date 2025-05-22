'use client';

import React, { forwardRef, MutableRefObject } from 'react';

import { motion } from 'framer-motion';

import { withMemo } from '@/shared/lib/utils/memo';

import { ThemeMode } from '../../model/constants';
import { ThemeOption } from '../../model/useThemeControl';

interface ThemeDropdownMenuProps {
  themes: ThemeOption[];
  currentTheme?: string;
  onSelect: (value: ThemeMode) => void;
}

const ThemeDropdownMenuBase = forwardRef<(HTMLButtonElement | null)[], ThemeDropdownMenuProps>(
  ({ themes, currentTheme, onSelect }, ref) => {
    // Безопасная проверка на тип ref
    const menuItemsRef = ref as MutableRefObject<(HTMLButtonElement | null)[]>;

    return (
      <motion.div
        id="theme-dropdown"
        className="absolute right-0 mt-2 py-2 w-40 bg-background rounded-xl shadow-lg border border-subtle/50 z-50"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        onClick={e => {
          e.stopPropagation();
        }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="theme-toggle-button"
      >
        {themes.map(({ value, label, icon: Icon }, index) => (
          <motion.button
            key={value}
            ref={el => {
              menuItemsRef.current[index] = el;
            }}
            className={`w-full flex items-center px-3 py-2 text-left text-sm ${
              currentTheme === value
                ? 'text-primary bg-primary/5 dark:bg-primary/10 font-medium'
                : 'text-foreground hover:bg-subtle dark:hover:bg-muted/10'
            }`}
            onClick={() => {
              onSelect(value);
            }}
            onKeyDown={e => {
              // Enter или Space для выбора элемента
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(value);
              }
            }}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            role="menuitem"
            aria-current={currentTheme === value ? 'true' : 'false'}
            aria-label={`Выбрать ${label.toLowerCase()} тему`}
            tabIndex={0}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </motion.button>
        ))}
      </motion.div>
    );
  },
);

// Добавляем displayName для лучшей отладки
ThemeDropdownMenuBase.displayName = 'ThemeDropdownMenuBase';

export const ThemeDropdownMenu = withMemo(ThemeDropdownMenuBase);
