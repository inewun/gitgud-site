import { test, expect } from '@playwright/test';

test.describe('Проверка адаптивности компонентов', () => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' },
    { width: 1920, height: 1080, name: 'large-desktop' },
  ];

  for (const viewport of viewports) {
    test(`Главная страница адаптируется к ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('/');

      // Проверка видимости основных элементов
      const header = page.locator('header');
      await expect(header).toBeVisible();

      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Проверка изменения стилей в зависимости от размера экрана
      if (viewport.width < 768) {
        // Проверки для мобильных устройств
        const mobileMenu = page.locator('button[aria-label="Toggle menu"]');
        await expect(mobileMenu).toBeVisible();
      } else {
        // Проверки для десктопов
        const navigation = page.locator('nav');
        await expect(navigation).toBeVisible();
      }

      // Создаем скриншот для визуального сравнения
      await page.screenshot({
        path: `./test-results/adaptive-${viewport.name}.png`,
        fullPage: true,
      });
    });

    test(`Компонент анонимизации адаптируется к ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('/');

      const anonymizeForm = page.locator('form[data-testid="anonymize-form"]');
      await expect(anonymizeForm).toBeVisible();

      // Проверка расположения элементов в зависимости от размера экрана
      const inputField = page.locator('textarea[name="text-to-anonymize"]');
      await expect(inputField).toBeVisible();

      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();

      // Проверка специфичных для адаптивности стилей
      if (viewport.width < 768) {
        // На мобильных устройствах кнопки должны быть в столбец
        const buttonContainer = page.locator('[data-testid="form-buttons"]');
        const buttonStyles = await buttonContainer.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            flexDirection: styles.flexDirection,
            width: styles.width,
          };
        });

        expect(buttonStyles.flexDirection).toBe('column');
      } else {
        // На десктопах кнопки должны быть в ряд
        const buttonContainer = page.locator('[data-testid="form-buttons"]');
        const buttonStyles = await buttonContainer.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            flexDirection: styles.flexDirection,
            width: styles.width,
          };
        });

        expect(buttonStyles.flexDirection).toBe('row');
      }
    });
  }
});
