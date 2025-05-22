'use client';

/**
 * Инициализирует детектор клавиатурной навигации
 * Добавляет класс 'keyboard-user' к body при навигации с помощью клавиатуры
 * и убирает его при использовании мыши
 * @returns Функция для очистки обработчиков событий
 */
export function initKeyboardNavigation(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Добавляем класс при нажатии Tab
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-user');
    }
  };

  // Убираем класс при использовании мыши
  const handleMouseDown = (): void => {
    document.body.classList.remove('keyboard-user');
  };

  // Устанавливаем обработчики событий
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);

  // Функция для очистки обработчиков
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
  };
}

/**
 * Хелпер для пропуска навигации к основному контенту
 * @param selector CSS селектор для перехода к основному контенту
 */
export function skipToContent(selector: string = 'main'): void {
  const mainContent = document.querySelector(selector);
  if (mainContent instanceof HTMLElement) {
    mainContent.tabIndex = -1;
    mainContent.focus();
    mainContent.scrollIntoView();
  }
}

/**
 * Проверяет, поддерживает ли браузер :focus-visible
 * Используется для полифиллов или условного рендеринга
 */
export function supportsFocusVisible(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof window === 'undefined') return false;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return CSS.supports('selector(:focus-visible)') || false;
}
