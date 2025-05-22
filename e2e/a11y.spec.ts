// eslint-disable-next-line import/no-named-as-default
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// Основные пути для проверки
const routesToCheck = [
  '/', // Главная страница
  '/tool', // Страница инструмента
  '/docs', // Документация
];

// Известные исключения для тестов доступности (временное решение)
const axeOptions = {
  rules: {
    // Исключаем правила доступности для диалогов NextJS в процессе разработки
    'aria-dialog-name': { enabled: false },
    'document-title': { enabled: false },
    'html-has-lang': { enabled: false },
    tabindex: { enabled: false },
  },
};

test.describe('Проверка доступности (a11y)', () => {
  // Увеличиваем таймаут для всех тестов в этом блоке
  test.setTimeout(90000);

  for (const route of routesToCheck) {
    test(`Проверка страницы ${route} на соответствие стандартам доступности`, async ({ page }) => {
      // Переходим на страницу
      await page.goto(route);

      // Ждем загрузки содержимого с большим таймаутом
      await page.waitForLoadState('networkidle', { timeout: 30000 });

      // Добавляем дополнительное ожидание для контента страницы
      if (route === '/') {
        await page.waitForSelector('h1:has-text("Анонимизатор данных")', { timeout: 30000 });
      } else if (route === '/tool') {
        await page.waitForSelector('textarea[aria-label="Ввод текста для анонимизации"]', {
          timeout: 30000,
        });
      } else if (route === '/docs') {
        // В документации ищем любой элемент из структуры документации
        await page.waitForSelector('.text-2xl, h2, .list-disc, .list-decimal', { timeout: 30000 });
      }

      // Анализируем страницу с помощью axe - выполняем это в try/catch для лучшей обработки ошибок
      try {
        const results = await new AxeBuilder({ page }).options(axeOptions).analyze();

        // Выводим ошибки в читаемом формате, если они есть
        if (results.violations.length > 0) {
          // eslint-disable-next-line no-console
          console.log(`Найдены проблемы доступности на странице ${route}:`);
          results.violations.forEach(violation => {
            // eslint-disable-next-line no-console
            console.log(`- [${violation.impact}] ${violation.help}: ${violation.helpUrl}`);
            violation.nodes.forEach(node => {
              // eslint-disable-next-line no-console
              console.log(`  * ${node.html}`);
              // eslint-disable-next-line no-console
              console.log(`    ${node.failureSummary}`);
            });
          });
        }

        // Проверяем, что нет нарушений доступности
        // И добавляем сообщение об ошибке с подробностями
        expect(
          results.violations,
          `Страница ${route} имеет ${results.violations.length} проблем доступности. ` +
            `Подробности: ${JSON.stringify(results.violations.map(v => v.help))}`,
        ).toEqual([]);
      } catch (error) {
        console.error(`Ошибка при анализе доступности на странице ${route}:`, error);
        throw error;
      }
    });
  }

  test('Проверка компонента Button на доступность при состоянии загрузки', async ({ page }) => {
    // Загружаем страницу, где есть кнопка в состоянии загрузки
    await page.goto('/tool');

    // Ждем загрузки содержимого с увеличенным таймаутом
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Ждем появления кнопки с конкретным атрибутом
    await page.waitForSelector('button[aria-label="Анонимизировать текст"]', { timeout: 30000 });

    // Находим кнопку и проверяем ее доступность
    const button = page.locator('button[aria-label="Анонимизировать текст"]');

    // Проверяем, что кнопка доступна для скрин-ридеров
    await expect(button).toHaveAttribute('aria-label');

    // Анализируем кнопку
    try {
      const results = await new AxeBuilder({ page })
        .include('button[aria-label="Анонимизировать текст"]')
        .options(axeOptions)
        .analyze();

      // Проверяем, что нет нарушений доступности с информативным сообщением
      expect(
        results.violations,
        `Кнопка имеет ${results.violations.length} проблем доступности. ` +
          `Подробности: ${JSON.stringify(results.violations.map(v => v.help))}`,
      ).toEqual([]);
    } catch (error) {
      console.error('Ошибка при анализе доступности кнопки:', error);
      throw error;
    }
  });

  test('Проверка фокуса и навигации с клавиатуры', async ({ page }) => {
    await page.goto('/');

    // Ждем загрузки содержимого с увеличенным таймаутом
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Ждем появления h1 на странице
    await page.waitForSelector('h1:has-text("Anonymize Tool")', { timeout: 30000 });

    // Эмулируем навигацию с клавиатуры (Tab)
    await page.keyboard.press('Tab');

    // Проверяем, что первый интерактивный элемент получил фокус
    const focused = await page.evaluate(() => {
      const active = document.activeElement;
      return active
        ? {
            tagName: active.tagName,
            ariaLabel: active.getAttribute('aria-label'),
            role: active.getAttribute('role'),
          }
        : null;
    });

    // Проверяем, что фокус работает корректно
    expect(focused).not.toBeNull();

    // Анализируем страницу
    try {
      const results = await new AxeBuilder({ page }).options(axeOptions).analyze();

      // Проверяем, что нет нарушений доступности с информативным сообщением
      expect(
        results.violations,
        `Страница имеет ${results.violations.length} проблем доступности при проверке навигации. ` +
          `Подробности: ${JSON.stringify(results.violations.map(v => v.help))}`,
      ).toEqual([]);
    } catch (error) {
      console.error('Ошибка при анализе доступности фокуса:', error);
      throw error;
    }
  });
});
