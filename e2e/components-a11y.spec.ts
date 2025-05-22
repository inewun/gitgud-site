import { AxeBuilder } from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

// Компоненты для тестирования доступности
const componentsToTest = [
  { name: 'Button', path: '/storybook-static/iframe.html?id=ui-buttons-button' },
  { name: 'TextInputField', path: '/storybook-static/iframe.html?id=ui-inputs-textinputfield' },
  { name: 'TextareaField', path: '/storybook-static/iframe.html?id=ui-inputs-textareafield' },
  { name: 'Checkbox', path: '/storybook-static/iframe.html?id=ui-inputs-checkbox' },
  { name: 'Select', path: '/storybook-static/iframe.html?id=ui-inputs-select' },
  { name: 'Card', path: '/storybook-static/iframe.html?id=ui-cards-card' },
  { name: 'NavigationMenu', path: '/storybook-static/iframe.html?id=ui-navigation-navigationmenu' },
  { name: 'Header', path: '/storybook-static/iframe.html?id=ui-navigation-header' },
  { name: 'Footer', path: '/storybook-static/iframe.html?id=ui-layout-footer' },
  { name: 'ThemeToggle', path: '/storybook-static/iframe.html?id=ui-feedback-themetoggle' },
  { name: 'ErrorBoundary', path: '/storybook-static/iframe.html?id=ui-feedback-errorboundary' },
  {
    name: 'AnonymizeForm',
    path: '/storybook-static/iframe.html?id=features-anonymize-anonymizeform',
  },
];

test.describe('Тесты доступности компонентов', () => {
  // Тестируем каждый компонент
  for (const component of componentsToTest) {
    test(`Проверка компонента ${component.name} на соответствие стандартам доступности`, async ({
      page,
    }) => {
      // Переходим к компоненту в Storybook
      await page.goto(component.path);

      // Ждем загрузки iframe со Storybook
      await page.waitForLoadState('networkidle');

      // Анализируем доступность с помощью axe
      const results = await new AxeBuilder({ page }).analyze();

      // Проверяем, что нет нарушений доступности
      expect(results.violations).toEqual([]);
    });

    // Тестируем фокусное состояние с клавиатурой
    test(`Проверка клавиатурной навигации для компонента ${component.name}`, async ({ page }) => {
      await page.goto(component.path);
      await page.waitForLoadState('networkidle');

      // Нажимаем Tab для перехода к первому интерактивному элементу
      await page.keyboard.press('Tab');

      // Проверяем, что элемент получил фокус
      const hasFocusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active && active !== document.body;
      });

      expect(hasFocusedElement).toBeTruthy();

      // Проверяем видимость фокусного состояния
      const focusVisibleStyles = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return null;

        const styles = window.getComputedStyle(active);
        return {
          outlineColor: styles.outlineColor,
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
          boxShadow: styles.boxShadow,
        };
      });

      // Проверяем наличие хотя бы одного индикатора фокуса
      const hasFocusIndicator =
        focusVisibleStyles &&
        (focusVisibleStyles.outlineWidth !== '0px' || focusVisibleStyles.boxShadow !== 'none');

      expect(hasFocusIndicator).toBeTruthy();
    });
  }

  // Детальный тест для Button фокусного состояния с клавиатуры (focus-visible)
  test('Проверка focus-visible стилей для компонента Button', async ({ page }) => {
    // Открываем компонент Button в Storybook
    await page.goto('/storybook-static/iframe.html?id=ui-buttons-button');
    await page.waitForLoadState('networkidle');

    // Находим все кнопки на странице
    const buttons = await page.locator('button').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Имитируем навигацию с клавиатуры
    await page.keyboard.press('Tab');

    // Проверяем, что активный элемент - это кнопка
    const isButtonFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.tagName.toLowerCase() === 'button';
    });
    expect(isButtonFocused).toBeTruthy();

    // Проверяем focus-visible стили
    const focusVisibleStyles = await page.evaluate(() => {
      const button = document.activeElement;
      if (!button) return null;

      const styles = window.getComputedStyle(button);

      // Проверяем наличие CSS переменных для фокуса
      const computedStyles = {
        outlineColor: styles.outlineColor,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
        // Проверяем, имеет ли элемент класс :focus-visible (через CSS)
        hasFocusVisiblePseudoClass: button.matches(':focus-visible'),
        // Получаем цвет кольца фокуса из CSS переменных
        ringColor:
          styles.getPropertyValue('--focus-ring-color') ||
          styles.getPropertyValue('--ring-color') ||
          styles.getPropertyValue('--ring-primary') ||
          '',
        ringOffset: styles.getPropertyValue('--focus-ring-offset') || '0px',
      };

      return computedStyles;
    });

    // Проверяем применение стилей focus-visible
    expect(focusVisibleStyles).not.toBeNull();
    expect(focusVisibleStyles?.hasFocusVisiblePseudoClass).toBeTruthy();

    // Проверяем, что кнопка имеет видимый индикатор фокуса
    const hasVisibleFocusIndicator =
      focusVisibleStyles?.outlineWidth !== '0px' || focusVisibleStyles.boxShadow !== 'none';
    expect(hasVisibleFocusIndicator).toBeTruthy();
  });

  // Проверка цветового контраста
  test('Проверка контраста цветов для всех компонентов', async ({ page }) => {
    // Переходим к странице с цветовой палитрой в Storybook
    await page.goto('/storybook-static/iframe.html?id=foundation-colors');
    await page.waitForLoadState('networkidle');

    // Анализируем доступность
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast']) // Только правила контраста
      .analyze();

    // Проверяем, что нет нарушений контраста
    expect(results.violations).toEqual([]);
  });

  // Тестирование поддержки скринридеров
  test('Проверка ARIA-атрибутов и семантических элементов', async ({ page }) => {
    await page.goto('/storybook-static/iframe.html?id=ui-inputs-textinputfield');
    await page.waitForLoadState('networkidle');

    // Проверяем наличие необходимых ARIA-атрибутов
    const hasAriaLabels = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select, textarea, button');
      return Array.from(inputs).every(input => {
        const hasLabel =
          input.hasAttribute('aria-label') ||
          input.hasAttribute('aria-labelledby') ||
          input.hasAttribute('title') ||
          (input.id && document.querySelector(`label[for="${input.id}"]`));

        return hasLabel;
      });
    });

    expect(hasAriaLabels).toBeTruthy();
  });
});
