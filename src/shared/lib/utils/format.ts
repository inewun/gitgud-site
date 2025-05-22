/**
 * Утилиты для форматирования данных
 *
 * @module shared/lib/utils/format
 */

/**
 * Форматирует число с разделителями разрядов
 *
 * @param value - Число для форматирования
 * @param options - Опции форматирования
 * @returns Отформатированное число
 */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('ru-RU', options).format(value);
}

/**
 * Форматирует дату в локализованную строку
 *
 * @param date - Дата для форматирования
 * @param options - Опции форматирования
 * @returns Отформатированная дата
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('ru-RU', options).format(dateObj);
}

/**
 * Форматирует строку с учетом падежей
 *
 * @param count - Количество объектов
 * @param forms - Массив форм слова [одна штука, две штуки, пять штук]
 * @returns Отформатированная строка с правильным падежом
 */
export function pluralize(count: number, forms: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)];
  return `${count} ${forms[index]}`;
}

/**
 * Обрезает текст до указанной длины с добавлением многоточия
 *
 * @param text - Текст для обрезки
 * @param maxLength - Максимальная длина текста
 * @param suffix - Строка, добавляемая к обрезанному тексту
 * @returns Обрезанный текст
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + suffix;
}

/**
 * Форматирует строку в "snake_case"
 *
 * @param text - Строка для форматирования
 * @returns Строка в формате snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Форматирует строку в "camelCase"
 *
 * @param text - Строка для форматирования
 * @returns Строка в формате camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/[-_\s](.)/g, (match, char: string) => char.toUpperCase())
    .replace(/^(.)/, (match, char: string) => char.toLowerCase());
}
