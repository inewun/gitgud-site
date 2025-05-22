import { readFileSync } from 'fs';

import { glob } from 'glob';

/**
 * Тесты для проверки безопасности кода
 * Ищет потенциально опасные паттерны и использование небезопасных методов
 */
describe('Проверка безопасности кода', () => {
  /**
   * Проверяет, что компоненты не используют dangerouslySetInnerHTML небезопасно
   */
  test('dangerouslySetInnerHTML должен использоваться только с предварительной санитизацией', async () => {
    // Получаем все файлы React компонентов
    const files = await glob('src/**/*.{tsx,jsx}');

    // Регулярное выражение для поиска использования dangerouslySetInnerHTML
    const dangerousPattern = /dangerouslySetInnerHTML\s*=\s*{\s*{\s*__html\s*:\s*([^}]+)\s*}\s*}/g;

    // Регулярное выражение для определения безопасного использования
    // (с DOMPurify.sanitize или другими санитайзерами)
    const safePatterns = [
      /DOMPurify\.sanitize\(/,
      /sanitizeHtml\(/,
      /escapeHtml\(/,
      /sanitizeInput\(/,
      /sanitized/i,
      /\.replace\(/,
    ];

    // Собираем все потенциально небезопасные случаи
    const unsafeUsages: Array<{ file: string; line: number; content: string }> = [];

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        // Ищем все использования dangerouslySetInnerHTML
        let match;
        while ((match = dangerousPattern.exec(content)) !== null) {
          const htmlContent = match[1];
          const isSafe = safePatterns.some(pattern => pattern.test(htmlContent));

          if (!isSafe) {
            // Находим номер строки
            const lineIndex = content.substring(0, match.index).split('\n').length - 1;

            unsafeUsages.push({
              file,
              line: lineIndex + 1,
              content: lines[lineIndex].trim(),
            });
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Ошибка при проверке файла ${file}:`, error);
      }
    }

    // Выводим подробную информацию о небезопасных использованиях
    if (unsafeUsages.length > 0) {
      // eslint-disable-next-line no-console
      console.error('Найдены небезопасные использования dangerouslySetInnerHTML:');
      unsafeUsages.forEach(({ file, line, content }) => {
        // eslint-disable-next-line no-console
        console.error(`  ${file}:${line}: ${content}`);
      });
    }

    // Тест должен падать, если найдены небезопасные использования
    expect(unsafeUsages).toEqual([]);
  });

  /**
   * Проверяет использование функций санитизации перед вставкой контента
   */
  test('Внешние данные должны проходить санитизацию перед отображением', async () => {
    // Получаем все файлы с кодом
    const files = await glob('src/**/*.{ts,tsx,js,jsx}');

    // Слова-индикаторы, указывающие на пользовательский или внешний контент
    const userContentIndicators = [
      'userContent',
      'userData',
      'content',
      'userInput',
      'externalContent',
      'htmlContent',
      'rawHtml',
      'markdownContent',
      'fromExternal',
      'fromUser',
    ];

    // Исключаем тестовые файлы из проверки
    const filteredFiles = files.filter(
      file => !file.includes('__tests__') && !file.includes('.test.') && !file.includes('.spec.'),
    );

    // Собираем потенциально опасные использования
    const potentialRisks: Array<{ file: string; line: number; content: string }> = [];

    for (const file of filteredFiles) {
      try {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        // Ищем использование опасных шаблонов
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Если строка содержит dangerouslySetInnerHTML
          if (line.includes('dangerouslySetInnerHTML')) {
            // Ищем в окружающих 5 строках индикаторы пользовательского контента
            const contextStart = Math.max(0, i - 5);
            const contextEnd = Math.min(lines.length - 1, i + 5);
            const context = lines.slice(contextStart, contextEnd + 1).join('\n');

            // Проверяем, содержит ли контекст индикаторы пользовательского контента
            // и не содержит ли функций санитизации
            const hasUserContentIndicator = userContentIndicators.some(indicator =>
              context.includes(indicator),
            );

            const hasSanitization =
              context.includes('sanitize') ||
              context.includes('escape') ||
              context.includes('purify');

            if (hasUserContentIndicator && !hasSanitization) {
              potentialRisks.push({
                file,
                line: i + 1,
                content: line.trim(),
              });
            }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Ошибка при проверке файла ${file}:`, error);
      }
    }

    // Выводим подробную информацию о потенциальных рисках
    if (potentialRisks.length > 0) {
      // eslint-disable-next-line no-console
      console.error('Найдены потенциальные риски XSS:');
      potentialRisks.forEach(({ file, line, content }) => {
        // eslint-disable-next-line no-console
        console.error(`  ${file}:${line}: ${content}`);
      });
    }

    // Тест должен падать, если найдены потенциальные риски
    expect(potentialRisks).toEqual([]);
  });
});
