/**
 * Санитизирует пользовательский ввод для предотвращения XSS и других проблем безопасности
 * @param input Текст для санитизации
 * @returns Санитизированный текст
 */
export function sanitizeInput(input: unknown): string {
  if (input === null || input === undefined) {
    return '';
  }

  // Преобразуем вход в строку, если это возможно
  const inputStr = String(input);

  // Заменяем HTML-теги на пустую строку (полностью удаляем теги)
  let sanitized = inputStr.replace(/<[^>]*>/g, '');

  // Заменяем HTML-сущности на соответствующие символы
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return sanitized;
}
