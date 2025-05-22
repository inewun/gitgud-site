import { test, expect } from '@playwright/test';

test.describe('Базовые тесты', () => {
  test('должна отображаться главная страница', async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('/');

    // Проверяем заголовок
    const title = await page.title();
    expect(title).toContain('Anonymize Tool');

    // Проверяем основной контент
    await expect(page.locator('main')).toBeVisible();
  });

  test('должно работать переключение тем', async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('/');

    // Ищем кнопку переключения темы по data-testid
    const themeToggle = page.getByTestId('theme-toggle');

    // Проверяем наличие кнопки
    await expect(themeToggle).toBeVisible();

    // Кликаем по кнопке переключения темы
    await themeToggle.click();

    // Дожидаемся открытия выпадающего меню
    const themeDropdown = page.locator('#theme-dropdown');
    await expect(themeDropdown).toBeVisible();

    // Выбираем темную тему
    await page.locator('#theme-dropdown button').filter({ hasText: 'Тёмная' }).click();

    // Проверяем, что тема изменилась на тёмную
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Снова открываем меню тем
    await themeToggle.click();
    await expect(themeDropdown).toBeVisible();

    // Выбираем светлую тему
    await page.locator('#theme-dropdown button').filter({ hasText: 'Светлая' }).click();

    // Проверяем, что тема изменилась на светлую
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
