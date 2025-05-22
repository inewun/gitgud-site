/**
 * Утилиты для работы с DOM
 *
 * @module shared/lib/utils/dom
 */

/**
 * Проверяет, поддерживает ли браузер определенное API
 *
 * @param feature - Имя проверяемого API
 * @returns Поддерживается ли API
 */
export function isSupported(feature: string): boolean {
  return typeof window !== 'undefined' && feature in window;
}

/**
 * Проверяет, запущено ли приложение на клиенте
 *
 * @returns true если код выполняется в браузере
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Проверяет, запущено ли приложение на сервере
 *
 * @returns true если код выполняется на сервере
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Добавляет обработчик события с автоматическим удалением
 *
 * @param element - DOM-элемент
 * @param event - Имя события
 * @param handler - Обработчик события
 * @param options - Опции события
 * @returns Функция для ручного удаления обработчика
 */
export function addEventListenerWithCleanup(
  element: HTMLElement | Document | Window,
  event: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions,
): () => void {
  // Создаем привязанную функцию для обработчика событий
  const boundHandler = handler.bind(element);

  element.addEventListener(event, boundHandler, options);

  return () => {
    element.removeEventListener(event, boundHandler, options);
  };
}

/**
 * Безопасно получает доступ к свойству документа
 * Проверяет наличие document перед обращением к свойству
 *
 * @param property - Имя свойства document
 * @returns Значение свойства или undefined, если document не доступен
 */
export function safeDocument<K extends keyof Document>(property: K): Document[K] | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  return document[property];
}

/**
 * Безопасно выполняет функцию только на клиенте
 *
 * @param fn - Функция для выполнения
 */
export function runOnlyInBrowser(fn: () => void): void {
  if (isClient()) {
    fn();
  }
}
