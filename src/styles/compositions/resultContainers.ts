/**
 * Композиции стилей для контейнеров результатов
 */

/** Тип для композиций контейнеров результатов */
export type ResultContainersComposition = {
  base: string;
  withBackground: string;
  withHighlight: string;
  header: string;
  preformatted: string;
};

/**
 * Стили для контейнеров результатов
 */
export const resultContainers: ResultContainersComposition = {
  // Базовый контейнер
  base: 'p-4 rounded-md',

  // Контейнер с фоном
  withBackground: 'p-4 rounded-md bg-muted',

  // Контейнер с выделением
  withHighlight: 'p-4 rounded-md border-2 border-primary',

  // Заголовок результата
  header: 'flex justify-between items-center mb-4 pb-2 border-b',

  // Предварительно отформатированный текст
  preformatted:
    'font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto p-2 bg-muted rounded-sm',
};
