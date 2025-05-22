import { test, expect } from '@playwright/test';

// Функция для преобразования HEX в RGB
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');

  // Проверяем сокращенный формат (#RGB)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
}

// Функция для вычисления относительной яркости по формуле WCAG
function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Функция для вычисления коэффициента контраста между двумя цветами
function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(hexToRgb(color1));
  const lum2 = getLuminance(hexToRgb(color2));

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

test.describe('Проверка контраста цветов', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Основные элементы должны иметь достаточный контраст для соответствия WCAG AA', async ({
    page,
  }) => {
    // Получаем текущие цвета темы
    const colors = await page.evaluate(() => {
      const computedStyles = window.getComputedStyle(document.documentElement);
      return {
        foreground: computedStyles.getPropertyValue('--color-foreground').trim(),
        background: computedStyles.getPropertyValue('--color-background').trim(),
        primary: computedStyles.getPropertyValue('--color-primary').trim(),
        primaryForeground: computedStyles.getPropertyValue('--color-primary-foreground').trim(),
        secondary: computedStyles.getPropertyValue('--color-secondary').trim(),
        secondaryForeground: computedStyles.getPropertyValue('--color-secondary-foreground').trim(),
        accent: computedStyles.getPropertyValue('--color-accent').trim(),
        accentForeground: computedStyles.getPropertyValue('--color-accent-foreground').trim(),
        muted: computedStyles.getPropertyValue('--color-muted').trim(),
        mutedForeground: computedStyles.getPropertyValue('--color-muted-foreground').trim(),
      };
    });

    // Преобразуем значения RGB в HEX
    const convertRgbToHex = (rgb: string): string => {
      if (!rgb) return '#000000';

      // Формат: rgb(r g b) или r g b
      const match = rgb.match(/(\d+)\s+(\d+)\s+(\d+)/);
      if (!match) return '#000000';

      const [, r, g, b] = match;
      return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
    };

    const colorPairs = [
      {
        name: 'Текст/Фон',
        fg: convertRgbToHex(colors.foreground),
        bg: convertRgbToHex(colors.background),
        minRatio: 4.5,
      },
      {
        name: 'Кнопка',
        fg: convertRgbToHex(colors.primaryForeground),
        bg: convertRgbToHex(colors.primary),
        minRatio: 4.5,
      },
      {
        name: 'Вторичная кнопка',
        fg: convertRgbToHex(colors.secondaryForeground),
        bg: convertRgbToHex(colors.secondary),
        minRatio: 4.5,
      },
      {
        name: 'Акцент',
        fg: convertRgbToHex(colors.accentForeground),
        bg: convertRgbToHex(colors.accent),
        minRatio: 4.5,
      },
      {
        name: 'Приглушенный',
        fg: convertRgbToHex(colors.mutedForeground),
        bg: convertRgbToHex(colors.background),
        minRatio: 3,
      },
    ];

    // Проверяем каждую пару цветов
    for (const pair of colorPairs) {
      const ratio = calculateContrastRatio(pair.fg, pair.bg);

      const errorMessage = `Контраст для '${pair.name}' недостаточен: ${ratio.toFixed(2)}:1, минимум ${pair.minRatio}:1`;
      expect(ratio >= pair.minRatio, errorMessage).toBe(true);
    }
  });

  test('Ссылки должны иметь достаточный контраст с фоном', async ({ page }) => {
    // Находим все ссылки на странице
    const links = await page.locator('a').all();

    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const link = links[i];

      // Получаем цвет текста ссылки и фона
      const linkColor = await link.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.color;
      });

      const bgColor = await link.evaluate(el => {
        // Находим фоновый цвет, проверяя родительские элементы, если нужно
        let current = el as HTMLElement;
        let bg = 'rgba(0, 0, 0, 0)';
        let iterations = 0;

        while (iterations < 5) {
          const style = window.getComputedStyle(current);
          bg = style.backgroundColor;

          // Если фон не прозрачный, используем его
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            break;
          }

          // Иначе проверяем родительский элемент
          const parent = current.parentElement;
          if (parent === null) break;
          current = parent;
          iterations++;
        }

        // Если не удалось найти непрозрачный фон, используем фон страницы
        if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
          const rootStyle = window.getComputedStyle(document.documentElement);
          bg = rootStyle.backgroundColor || '#FFFFFF';
        }

        return bg;
      });

      // Преобразуем в HEX
      const rgbToHex = (rgb: string): string => {
        // Предполагаем формат 'rgb(r, g, b)' или 'rgba(r, g, b, a)'
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) return '#000000';

        const [, r, g, b] = match;
        return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
      };

      const linkHex = rgbToHex(linkColor);
      const bgHex = rgbToHex(bgColor);

      // Вычисляем контраст
      const ratio = calculateContrastRatio(linkHex, bgHex);

      // Для ссылок минимальный контраст должен быть 4.5:1 для WCAG AA
      const errorMessage = `Контраст для ссылки недостаточен: ${ratio.toFixed(2)}:1, текст ${linkHex} на фоне ${bgHex}`;
      expect(ratio >= 4.5, errorMessage).toBe(true);
    }
  });
});
