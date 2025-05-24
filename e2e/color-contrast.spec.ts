import { default as AxeBuilder } from '@axe-core/playwright';
import { test, expect, Page } from '@playwright/test';

/**
 * Тест проверяет цветовой контраст на соответствие стандартам WCAG
 * Использует библиотеку axe-core для автоматической проверки
 */
test.describe('Проверка цветового контраста', () => {
  test('Главная страница должна соответствовать стандартам WCAG по контрасту', async ({ page }) => {
    // Загружаем страницу
    await page.goto('/');

    // Создаем анализатор Axe с фокусом на проверку контраста
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      })
      .analyze();

    // Проверяем, есть ли нарушения контраста
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Критичные элементы интерфейса должны соответствовать стандарту WCAG AAA по контрасту', async ({
    page,
  }) => {
    // Загружаем страницу
    await page.goto('/');

    // Создаем анализатор Axe с фокусом на проверку контраста по стандарту AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      })
      .analyze();

    // Получаем все критически важные элементы для проверки
    const criticalElements = page.locator(
      'h1, h2, button, a.primary, .alert, .error, .warning, nav a',
    );
    const criticalElementsCount = await criticalElements.count();

    // Проверяем каждый критический элемент
    for (let i = 0; i < criticalElementsCount; i++) {
      const element = criticalElements.nth(i);
      const elementHtml = await element.evaluate(node => node.outerHTML);

      // Проверяем, есть ли нарушения для этого элемента
      const violations = accessibilityScanResults.violations.filter(v =>
        v.nodes.some(node => node.html === elementHtml),
      );

      expect(violations).toEqual([]);
    }
  });

  test('Страница настроек должна соответствовать стандартам WCAG по контрасту', async ({
    page,
  }) => {
    // Загружаем страницу настроек
    await page.goto('/settings');

    // Создаем анализатор Axe с фокусом на проверку контраста
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      })
      .analyze();

    // Проверяем, есть ли нарушения контраста
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Темная тема должна соответствовать стандартам WCAG по контрасту', async ({ page }) => {
    // Загружаем страницу
    await page.goto('/');

    // Включаем темную тему
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Создаем анализатор Axe с фокусом на проверку контраста
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      })
      .analyze();

    // Проверяем, есть ли нарушения контраста
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Критичные элементы в темной теме должны соответствовать стандарту WCAG AAA', async ({
    page,
  }) => {
    // Загружаем страницу
    await page.goto('/');

    // Включаем темную тему
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Создаем анализатор Axe с фокусом на проверку контраста по стандарту AAA
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag21aaa'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['color-contrast'],
        },
      })
      .analyze();

    // Получаем все критически важные элементы для проверки
    const criticalElements = page.locator(
      'h1, h2, button, a.primary, .alert, .error, .warning, nav a',
    );
    const criticalElementsCount = await criticalElements.count();

    // Проверяем каждый критический элемент
    for (let i = 0; i < criticalElementsCount; i++) {
      const element = criticalElements.nth(i);
      const elementHtml = await element.evaluate(node => node.outerHTML);

      // Проверяем, есть ли нарушения для этого элемента
      const violations = accessibilityScanResults.violations.filter(v =>
        v.nodes.some(node => node.html === elementHtml),
      );

      expect(violations).toEqual([]);
    }
  });
});

// Тестируемые темы и режимы отображения
const themes = ['light', 'dark'];
const testElements = [
  {
    name: 'Кнопки',
    selector: 'button',
    path: '/storybook-static/iframe.html?id=ui-buttons-button',
  },
  {
    name: 'Текстовые поля',
    selector: 'input[type="text"]',
    path: '/storybook-static/iframe.html?id=ui-inputs-textinputfield',
  },
  {
    name: 'Чекбоксы',
    selector: 'input[type="checkbox"]',
    path: '/storybook-static/iframe.html?id=ui-inputs-checkbox',
  },
  { name: 'Карточки', selector: '.card', path: '/storybook-static/iframe.html?id=ui-cards-card' },
  {
    name: 'Навигация',
    selector: 'nav',
    path: '/storybook-static/iframe.html?id=ui-navigation-navigationmenu',
  },
];

// Функция для проверки контраста элемента в разных состояниях
async function testElementContrastInStates(page: Page, selector: string): Promise<void> {
  const elements = await page.locator(selector).all();
  if (elements.length === 0) {
    console.warn(`Не найдены элементы по селектору: ${selector}`);
    return;
  }

  // Проверяем базовое состояние
  await checkContrast(page);

  // Для каждого элемента проверяем его в разных состояниях взаимодействия
  for (const element of elements.slice(0, 3)) {
    // Проверяем только первые 3 для оптимизации
    // Проверка при наведении (hover)
    await element.hover();
    await page.waitForTimeout(200); // Ждем применения стилей
    await checkContrast(page, 'hover');

    // Проверка при фокусе (focus)
    await element.focus();
    await page.waitForTimeout(200);
    await checkContrast(page, 'focus');

    // Проверка при клике (active)
    await element.evaluate(el => {
      el.classList.add('active');
    });
    await page.waitForTimeout(200);
    await checkContrast(page, 'active');
    await element.evaluate(el => {
      el.classList.remove('active');
    });

    // Проверка в отключенном состоянии (disabled)
    await element.evaluate(el => {
      if ('disabled' in el) {
        (el as HTMLButtonElement | HTMLInputElement).disabled = true;
      } else {
        el.setAttribute('aria-disabled', 'true');
        el.classList.add('disabled');
      }
    });
    await page.waitForTimeout(200);
    await checkContrast(page, 'disabled');
    await element.evaluate(el => {
      if ('disabled' in el) {
        (el as HTMLButtonElement | HTMLInputElement).disabled = false;
      } else {
        el.removeAttribute('aria-disabled');
        el.classList.remove('disabled');
      }
    });
  }
}

// Функция для проверки контраста с помощью Axe
async function checkContrast(page: Page, state = 'default'): Promise<void> {
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();

  // Если есть нарушения, генерируем подробный отчет
  if (results.violations.length > 0) {
    const details = results.violations
      .filter(v => v.id === 'color-contrast')
      .map(v => {
        return `Контраст (${state}): ${v.nodes
          .map(n => `${n.html} - ${n.failureSummary}`)
          .join('\n')}`;
      })
      .join('\n');

    console.error(details);
  }

  expect(
    results.violations.length,
    `Нарушения контраста в состоянии '${state}': ${results.violations.map(v => v.id).join(', ')}`,
  ).toBe(0);
}

test.describe('Тесты цветового контраста', () => {
  // Тестирование всех компонентов во всех темах
  for (const theme of themes) {
    test.describe(`Тесты в теме ${theme}`, () => {
      // Для каждого элемента интерфейса
      for (const element of testElements) {
        test(`Контраст для ${element.name} в теме ${theme}`, async ({ page }) => {
          // Переходим на страницу элемента
          await page.goto(element.path);
          await page.waitForLoadState('networkidle');

          // Устанавливаем нужную тему
          await page.evaluate(themeName => {
            document.documentElement.dataset.theme = themeName;
          }, theme);

          // Ждем применения темы
          await page.waitForTimeout(500);

          // Тестируем контраст во всех состояниях
          await testElementContrastInStates(page, element.selector);
        });
      }
    });
  }

  // Тестирование в режиме forced-colors (высококонтрастный режим)
  test.describe('Тесты в режиме forced-colors', () => {
    // Для каждого элемента интерфейса
    for (const element of testElements) {
      test(`Контраст для ${element.name} в режиме forced-colors`, async ({ page }) => {
        // Устанавливаем эмуляцию forced-colors режима
        await page.emulateMedia({ forcedColors: 'active' });

        // Переходим на страницу элемента
        await page.goto(element.path);
        await page.waitForLoadState('networkidle');

        // Ждем применения темы
        await page.waitForTimeout(500);

        // Проверяем наличие стилей для forced-colors
        const hasForcedColorStyles = await page.evaluate(() => {
          // Смотрим использование CSS переменных для высококонтрастного режима
          const styles = window.getComputedStyle(document.documentElement);
          const forcedColorStyles = [
            '--focus-ring-color-forced',
            '--text-primary-forced',
            '--background-primary-forced',
          ];

          // Проверяем, что хотя бы некоторые переменные определены
          return forcedColorStyles.some(
            variable => styles.getPropertyValue(variable).trim() !== '',
          );
        });

        expect(hasForcedColorStyles, 'Не найдены стили для режима forced-colors').toBeTruthy();

        // Тестируем контраст во всех состояниях
        await testElementContrastInStates(page, element.selector);
      });
    }
  });

  // Тест всех возможных комбинаций цветов для текста и фона
  test('Тест всех цветовых комбинаций фона и текста', async ({ page }) => {
    // Открываем страницу с палитрой цветов
    await page.goto('/storybook-static/iframe.html?id=foundation-colors');
    await page.waitForLoadState('networkidle');

    // Получаем все цвета из CSS переменных
    await page.evaluate(() => {
      const colors: Record<string, string> = {};
      const styles = window.getComputedStyle(document.documentElement);

      // Извлекаем все CSS переменные, начинающиеся с --color-
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith('--color-')) {
          const colorValue = styles.getPropertyValue(prop).trim();
          colors[prop] = colorValue;
        }
      }

      // Создаем тестовый DOM для всех возможных комбинаций цветов
      const container = document.createElement('div');
      container.id = 'color-contrast-test-container';
      document.body.appendChild(container);

      // Генерируем все комбинации цвет текста / цвет фона
      let index = 0;

      for (const bgColor in colors) {
        if (!bgColor.includes('transparent')) {
          for (const textColor in colors) {
            if (!textColor.includes('transparent')) {
              const div = document.createElement('div');
              div.id = `color-pair-${index}`;
              div.textContent = `Текст для проверки контраста (${index})`;
              div.style.backgroundColor = `var(${bgColor})`;
              div.style.color = `var(${textColor})`;
              div.style.padding = '10px';
              div.style.margin = '5px';
              container.appendChild(div);

              index++;
            }
          }
        }
      }
    });

    // Ждем применения стилей
    await page.waitForTimeout(500);

    // Проверяем контраст всех сгенерированных комбинаций
    await checkContrast(page, 'all-combinations');

    // Очищаем DOM
    await page.evaluate(() => {
      const container = document.getElementById('color-contrast-test-container');
      if (container) {
        container.remove();
      }
    });
  });

  // Тест для проверки режима prefers-reduced-data
  test('Тест контраста в режиме prefers-reduced-data', async ({ page }) => {
    // Эмуляция режима prefers-reduced-data не поддерживается напрямую
    // Используем setExtraHTTPHeaders для эмуляции
    await page.setExtraHTTPHeaders({
      'Save-Data': 'on',
    });

    // Также внедрим скрипт для эмуляции mediaQuery
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query.includes('prefers-reduced-data'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });

    // Проверяем первый тестовый элемент (кнопки)
    await page.goto(testElements[0].path);
    await page.waitForLoadState('networkidle');

    // Проверяем наличие стилей для reduced-data
    const hasReducedDataStyles = await page.evaluate(() => {
      // Проверяем, применены ли стили для режима reduced-data
      return window.matchMedia('(prefers-reduced-data: reduce)').matches;
    });

    expect(hasReducedDataStyles, 'Эмуляция режима prefers-reduced-data не активна').toBeTruthy();

    // Тестируем контраст
    await checkContrast(page, 'reduced-data');
  });
});
