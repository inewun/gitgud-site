'use client';

import React, { useState, useEffect } from 'react';

/**
 * Интерфейс настроек доступности
 */
interface AccessibilitySettings {
  /**
   * Увеличенный размер шрифта
   */
  largeText: boolean;
  /**
   * Высокая контрастность
   */
  highContrast: boolean;
  /**
   * Уменьшенная анимация
   */
  reducedMotion: boolean;
  /**
   * Сочетания клавиш для навигации
   */
  keyboardShortcuts: boolean;
}

// Начальные настройки
const defaultSettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  keyboardShortcuts: true,
};

/**
 * Компонент AccessibilitySettings предоставляет пользовательский интерфейс
 * для настройки параметров доступности приложения
 */
export default function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isOpen, setIsOpen] = useState(false);

  // Загрузка сохраненных настроек
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings) as AccessibilitySettings;
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек доступности:', error);
    }
  }, []);

  // Применение настроек к документу
  const applySettings = (newSettings: AccessibilitySettings) => {
    // Применяем настройки к документу
    document.documentElement.classList.toggle('large-text', newSettings.largeText);
    document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);
    document.documentElement.classList.toggle('reduced-motion', newSettings.reducedMotion);

    // Сохраняем настройки в localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));

    // Устанавливаем prefers-reduced-motion для всего приложения
    if (newSettings.reducedMotion) {
      document.documentElement.style.setProperty('--reduce-motion', 'reduce');
    } else {
      document.documentElement.style.removeProperty('--reduce-motion');
    }
  };

  // Обновление настроек
  const updateSettings = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  // Переключение панели настроек
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Сброс настроек
  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  return (
    <div className="fixed bottom-16 right-4 z-50">
      {/* Кнопка для открытия панели */}
      <button
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-label="Настройки доступности"
        className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      {/* Панель настроек */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-64 bg-card p-4 rounded-lg shadow-xl border">
          <h2 className="text-lg font-semibold mb-3">Настройки доступности</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="largeText" className="text-sm">
                Крупный текст
              </label>
              <input
                type="checkbox"
                id="largeText"
                checked={settings.largeText}
                onChange={e => {
                  updateSettings('largeText', e.target.checked);
                }}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="highContrast" className="text-sm">
                Высокий контраст
              </label>
              <input
                type="checkbox"
                id="highContrast"
                checked={settings.highContrast}
                onChange={e => {
                  updateSettings('highContrast', e.target.checked);
                }}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="reducedMotion" className="text-sm">
                Меньше анимации
              </label>
              <input
                type="checkbox"
                id="reducedMotion"
                checked={settings.reducedMotion}
                onChange={e => {
                  updateSettings('reducedMotion', e.target.checked);
                }}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="keyboardShortcuts" className="text-sm">
                Горячие клавиши
              </label>
              <input
                type="checkbox"
                id="keyboardShortcuts"
                checked={settings.keyboardShortcuts}
                onChange={e => {
                  updateSettings('keyboardShortcuts', e.target.checked);
                }}
                className="h-4 w-4"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={resetSettings}
              className="text-xs px-2 py-1 bg-subtle rounded"
              aria-label="Сбросить настройки доступности"
            >
              Сбросить
            </button>
            <button
              onClick={togglePanel}
              className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded"
              aria-label="Закрыть панель настроек доступности"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
