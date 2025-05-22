'use client';

import { useState, useEffect } from 'react';

/**
 * Хук для определения значения prefers-reduced-motion
 * Позволяет компонентам адаптироваться к предпочтениям пользователя по уменьшению анимаций
 *
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
 * @returns {boolean} true - если пользователь предпочитает уменьшенную анимацию, false - если нет
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * // Использование в компоненте
 * const animationProps = prefersReducedMotion
 *   ? { animate: { opacity: 1 } } // Простая анимация
 *   : { animate: { opacity: 1, y: 0 } }; // Полная анимация
 */
export function useReducedMotion(): boolean {
  // Состояние по умолчанию (считаем, что нет предпочтения)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Создаем медиа-запрос
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Устанавливаем начальное значение
    setPrefersReducedMotion(mediaQuery.matches);

    // Функция-обработчик изменений настройки
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Подписываемся на изменения
    // eslint-disable-next-line @typescript-eslint/unbound-method
    mediaQuery.addEventListener('change', handleChange);

    // Отписываемся при размонтировании
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
