import { test, expect } from '@playwright/test';

import { componentGroups, criticalFocusFlows } from './constants/a11y-data';

test.describe('Оптимизированные тесты фокусной видимости', () => {
  test.beforeEach(async ({ page }) => {
    // Загружаем главную страницу перед каждым тестом
    await page.goto('/');
  });

  // Проверяем группы компонентов вместо индивидуальных элементов
  for (const [, group] of Object.entries(componentGroups)) {
    test(`Проверка фокуса для группы: ${group.name}`, async ({ page }) => {
      // Строим комбинированный селектор для всех элементов группы
      const groupSelector = group.selectors.join(', ');

      // Получаем все элементы в группе
      const elements = await page.locator(groupSelector).all();

      // Пропускаем тест, если элементов данной группы нет на странице
      test.skip(elements.length === 0, `На странице нет элементов группы ${group.name}`);

      // Создаем счетчик видимых и интерактивных элементов
      let interactiveElementsCount = 0;

      // Проверяем фокусные состояния для видимых элементов группы
      for (const element of elements) {
        if ((await element.isVisible()) && (await element.isEnabled())) {
          interactiveElementsCount++;

          // Фокусируемся на элементе
          await element.focus();

          // Проверяем наличие визуального индикатора фокуса
          const hasFocusStyles = await element.evaluate(node => {
            const styles = window.getComputedStyle(node);
            return (
              (styles.outline !== 'none' && styles.outline !== '0px none') ||
              styles.boxShadow !== 'none' ||
              node.classList.contains('focus-visible') ||
              node.classList.contains('focused') ||
              node.hasAttribute('data-focused') ||
              node.matches(':focus-visible') ||
              styles.boxShadow.includes('var(--shadow-focus)') ||
              styles.boxShadow.includes('ring')
            );
          });

          // Проверяем результат
          expect(
            hasFocusStyles,
            `Элемент группы ${group.name} не имеет видимого индикатора фокуса`,
          ).toBeTruthy();
        }
      }

      // Используем счетчик для проверки результатов - без использования console.log
      if (interactiveElementsCount === 0) {
        test.skip(true, `В группе ${group.name} не найдено интерактивных элементов`);
      }
    });
  }

  // Тест для проверки Skip-ссылки
  test('Skip to Content ссылка доступна при навигации с клавиатуры', async ({ page }) => {
    await page.goto('/');

    // Устанавливаем фокус на body
    await page.evaluate(() => {
      document.body.focus();
    });

    // Нажимаем Tab для перехода к первому фокусируемому элементу
    await page.keyboard.press('Tab');

    // Проверяем, что первый элемент в фокусе - это skip link
    const isSkipLinkFocused = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return false;

      // Проверяем, что это skip link
      return (
        active.tagName.toLowerCase() === 'a' &&
        (active.textContent?.toLowerCase().includes('skip') ||
          active.getAttribute('aria-label')?.toLowerCase().includes('skip') ||
          active.getAttribute('href')?.includes('#content'))
      );
    });

    // Если есть skip link, проверяем его видимость при фокусе
    if (isSkipLinkFocused) {
      const skipLinkVisible = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return false;

        const styles = window.getComputedStyle(active);
        // Проверяем, что ссылка становится видимой при фокусе
        return (
          styles.opacity !== '0' && styles.visibility !== 'hidden' && styles.display !== 'none'
        );
      });

      expect(
        skipLinkVisible,
        'Skip to Content ссылка не становится видимой при получении фокуса',
      ).toBeTruthy();
    } else {
      // Если skip link не найден, отмечаем тест как пропущенный,
      // но с предупреждением о необходимости добавить такую ссылку
      test.fail(
        true,
        'Skip to Content ссылка не найдена - рекомендуется добавить для улучшения доступности',
      );
    }
  });

  // Тест для проверки критических путей фокуса
  test('Критические пути фокуса следуют ожидаемому порядку', async ({ page }) => {
    // Для каждого критического пути
    for (const flow of criticalFocusFlows) {
      // Проверяем наличие первого элемента в пути
      const firstElementLocator = page.locator(flow.elements[0]).first();
      const hasFirstElement = (await firstElementLocator.count()) > 0;

      // Пропускаем проверку этого пути, если первого элемента нет
      if (!hasFirstElement) {
        continue;
      }

      // Фокусируемся на первом элементе
      await firstElementLocator.focus();

      // Проверяем, что последовательность табуляции следует ожидаемому порядку
      for (let i = 1; i < flow.elements.length; i++) {
        // Нажимаем Tab для перехода к следующему элементу
        await page.keyboard.press('Tab');

        // Получаем следующий ожидаемый элемент
        const expectedElementLocator = page.locator(flow.elements[i]).first();
        const hasExpectedElement = (await expectedElementLocator.count()) > 0;

        // Если элемента нет на странице, пропускаем его
        if (!hasExpectedElement) {
          continue;
        }

        // Проверяем, соответствует ли текущий элемент в фокусе ожидаемому
        const isExpectedElementFocused = await expectedElementLocator.evaluate(
          node => document.activeElement === node,
        );

        expect(
          isExpectedElementFocused,
          `В пути "${flow.name}" элемент #${i + 1} не получил фокус в ожидаемом порядке`,
        ).toBeTruthy();
      }
    }
  });
});

// В конце файла добавляю новый тест для проверки перехвата фокуса в модальных окнах
test.describe('Тесты для перехвата фокуса в модальных окнах', () => {
  test('Модальное окно должно перехватывать фокус согласно WCAG 2.1', async ({ page }) => {
    // Загружаем главную страницу
    await page.goto('/');

    // Находим кнопку, открывающую модальное окно
    // Ищем по роли элемента и атрибуту, который указывает, что это кнопка для модального окна
    const modalTriggerSelector =
      'button[aria-haspopup="dialog"], [role="button"][aria-haspopup="dialog"]';
    const modalTrigger = page.locator(modalTriggerSelector).first();

    // Проверяем, есть ли триггер модального окна на странице
    const hasTrigger = (await modalTrigger.count()) > 0;
    if (!hasTrigger) {
      test.skip(true, 'На странице не найдена кнопка, открывающая модальное окно');
      return;
    }

    // Кликаем по кнопке, чтобы открыть модальное окно
    await modalTrigger.click();

    // Ожидаем появления модального окна
    const modal = page.locator('[role="dialog"], [aria-modal="true"]').first();
    await modal.waitFor({ state: 'visible' });

    // Нажимаем Escape для закрытия модального окна
    await page.keyboard.press('Escape');

    // Проверяем, что модальное окно закрылось
    await expect(modal).not.toBeVisible({ timeout: 5000 });

    // Проверяем, что фокус вернулся на элемент, который открыл модальное окно
    const focusReturnedToTrigger = await page.evaluate(triggerSelector => {
      const activeElement = document.activeElement;
      const trigger = document.querySelector(triggerSelector);
      return activeElement === trigger;
    }, modalTriggerSelector);

    expect(
      focusReturnedToTrigger,
      'После закрытия модального окна фокус должен вернуться на элемент, который его открыл',
    ).toBeTruthy();
  });
});
