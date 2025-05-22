'use client';

import { useState, useEffect } from 'react';

/**
 * Хук для определения предпочтений пользователя по высокому контрасту
 * Позволяет адаптировать интерфейс для пользователей с нарушениями зрения
 *
 * @returns {ContrastPreference} Текущее значение предпочтения контраста
 *
 * @example
 * const contrastPreference = useHighContrast();
 *
 * // Использование в компоненте
 * return (
 *   <div className={contrastPreference === 'more' ? 'high-contrast' : ''}>
 *     Контент
 *   </div>
 * );
 */
export type ContrastPreference = 'no-preference' | 'more' | 'less' | 'custom';

export function useHighContrast(): ContrastPreference {
  // Состояние по умолчанию
  const [contrastPreference, setContrastPreference] = useState<ContrastPreference>('no-preference');

  useEffect(() => {
    // Создаем медиа-запрос для высокого контраста
    const moreContrastQuery = window.matchMedia('(prefers-contrast: more)');
    const lessContrastQuery = window.matchMedia('(prefers-contrast: less)');
    const customContrastQuery = window.matchMedia('(prefers-contrast: custom)');

    // Функция для обновления состояния на основе всех запросов
    const updateContrastPreference = () => {
      if (moreContrastQuery.matches) {
        setContrastPreference('more');
      } else if (lessContrastQuery.matches) {
        setContrastPreference('less');
      } else if (customContrastQuery.matches) {
        setContrastPreference('custom');
      } else {
        setContrastPreference('no-preference');
      }
    };

    // Устанавливаем начальное значение
    updateContrastPreference();

    // Функция-обработчик изменений настройки
    const handleMoreChange = () => {
      updateContrastPreference();
    };
    const handleLessChange = () => {
      updateContrastPreference();
    };
    const handleCustomChange = () => {
      updateContrastPreference();
    };

    // Подписываемся на изменения
    // eslint-disable-next-line @typescript-eslint/unbound-method
    moreContrastQuery.addEventListener('change', handleMoreChange);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    lessContrastQuery.addEventListener('change', handleLessChange);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    customContrastQuery.addEventListener('change', handleCustomChange);

    // Отписываемся при размонтировании
    return () => {
      moreContrastQuery.removeEventListener('change', handleMoreChange);
      lessContrastQuery.removeEventListener('change', handleLessChange);
      customContrastQuery.removeEventListener('change', handleCustomChange);
    };
  }, []);

  return contrastPreference;
}
