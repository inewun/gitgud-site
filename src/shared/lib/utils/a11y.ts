/**
 * Утилиты для обеспечения доступности (a11y)
 *
 * @module shared/lib/utils/a11y
 */

/**
 * Типы сообщений для экранных читалок
 */
export enum AriaLiveType {
  /** Сообщение высокого приоритета */
  ASSERTIVE = 'assertive',
  /** Сообщение обычного приоритета */
  POLITE = 'polite',
  /** Отключенное уведомление */
  OFF = 'off',
}

/**
 * Проверяет, находится ли элемент в фокусе
 *
 * @param element - DOM-элемент для проверки
 * @returns true если элемент в фокусе
 */
export function isElementFocused(element: HTMLElement | null): boolean {
  return element !== null && document.activeElement === element;
}

/**
 * Генерирует уникальный ID для связи элементов label и input
 *
 * @param prefix - Префикс для ID
 * @returns Уникальный ID
 */
export function generateUniqueId(prefix: string = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Проверяет, запущен ли режим высокой контрастности
 *
 * @returns true если включен режим высокой контрастности
 */
export function isHighContrastMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Проверка через медиа-запрос
  return window.matchMedia('(forced-colors: active)').matches;
}

/**
 * Проверяет, запущен ли режим уменьшенного движения
 *
 * @returns true если включен режим уменьшенного движения
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Проверяет, используется ли тёмная тема
 *
 * @returns true если используется тёмная тема
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Сначала проверим data-theme
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    return true;
  }

  // Затем проверим системные настройки
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Фокусирует первый интерактивный элемент внутри контейнера
 *
 * @param container - Контейнер для поиска интерактивных элементов
 */
export function focusFirstInteractive(container: HTMLElement): void {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length > 0) {
    focusable[0].focus();
  }
}

/**
 * Проверяет, доступен ли элемент для экранных читалок
 *
 * @param element - DOM-элемент для проверки
 * @returns true если элемент доступен для скрин-ридеров
 */
export function isElementAccessible(element: HTMLElement): boolean {
  // Проверяем видимость и атрибуты
  const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
  const isAriaHidden = element.getAttribute('aria-hidden') === 'true';
  const isHidden = element.hidden;

  return isVisible && !isAriaHidden && !isHidden;
}
