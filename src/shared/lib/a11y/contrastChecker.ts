/**
 * Утилита для автоматической проверки контраста компонентов
 * Использует axe-core для проверки соответствия WCAG 2.1 AA/AAA стандартам
 *
 * @module shared/lib/a11y/contrastChecker
 */

import { axe, toHaveNoViolations } from 'jest-axe';

// Определяем интерфейс для результатов axe
interface AxeViolation {
  id: string;
  impact: string;
  description: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary?: string;
  }>;
}

interface AxeResults {
  violations: AxeViolation[];
  passes: unknown[];
  incomplete: unknown[];
  inapplicable: unknown[];
}

/**
 * Объект с предустановленными правилами проверки контраста
 * Соответствует требованиям WCAG 2.1 AA/AAA
 */
export const contrastRules = {
  wcagAA: {
    normalText: 4.5, // Минимальное соотношение контраста для обычного текста (AA)
    largeText: 3, // Минимальное соотношение контраста для крупного текста (AA)
  },
  wcagAAA: {
    normalText: 7, // Минимальное соотношение контраста для обычного текста (AAA)
    largeText: 4.5, // Минимальное соотношение контраста для крупного текста (AAA)
  },
};

/**
 * Интерфейс для настроек проверки контраста
 */
export interface ContrastCheckOptions {
  /** Уровень проверки контраста: 'AA' или 'AAA' */
  level?: 'AA' | 'AAA';
  /** Игнорировать определенные правила */
  ignore?: string[];
  /** Дополнительные правила для проверки */
  rules?: Record<string, unknown>;
}

// Определяем типы для axe конфигурации
interface AxeRunOptions {
  rules?: Record<string, unknown>;
  resultTypes?: ('violations' | 'passes' | 'incomplete' | 'inapplicable')[];
  checks?: Array<{
    id: string;
    options: Record<string, unknown>;
  }>;
  disabledRules?: string[];
}

/**
 * Создает конфигурацию axe для проверки контраста
 *
 * @param options - Настройки проверки контраста
 * @returns Конфигурация axe для проверки контраста
 */
export function createContrastConfig(options: ContrastCheckOptions = {}): AxeRunOptions {
  const { level = 'AA', ignore = [], rules = {} } = options;

  return {
    rules: {
      'color-contrast': { enabled: true, ...rules },
      ...rules,
    },
    resultTypes: ['violations'],
    checks: [
      {
        id: 'color-contrast',
        options: {
          noScroll: true,
          contrastRatio: level === 'AA' ? contrastRules.wcagAA : contrastRules.wcagAAA,
        },
      },
    ],
    disabledRules: ignore,
  };
}

/**
 * Проверяет контраст HTML-элемента с помощью axe
 *
 * @param html - HTML-элемент или строка для проверки
 * @param options - Настройки проверки контраста
 * @returns Promise с результатами проверки
 */
export async function checkContrast(
  html: string | HTMLElement,
  options: ContrastCheckOptions = {},
): Promise<AxeResults> {
  const axeConfig = createContrastConfig(options);
  const results = await axe(html, axeConfig);
  return results as AxeResults;
}

/**
 * Jest-матчер для проверки контраста в тестах
 *
 * @example
 * expect(container).toPassContrastCheck();
 * expect(container).toPassContrastCheck({ level: 'AAA' });
 */
export function setupContrastMatchers() {
  expect.extend(toHaveNoViolations);
  expect.extend({
    async toPassContrastCheck(received: HTMLElement, options: ContrastCheckOptions = {}) {
      const result = await checkContrast(received, options);
      const pass = result.violations.length === 0;

      if (pass) {
        return {
          message: () => 'Проверка контраста пройдена успешно',
          pass: true,
        };
      }

      return {
        message: () =>
          `Найдены проблемы с контрастом:\n${JSON.stringify(result.violations, null, 2)}`,
        pass: false,
      };
    },
  });
}

/**
 * Функция для использования в CI для проверки контраста компонентов
 *
 * @param testFn - Функция для подготовки и тестирования компонентов
 */
export async function runContrastChecks(testFn: () => Promise<HTMLElement[]>) {
  const elements = await testFn();

  for (const element of elements) {
    const result = await checkContrast(element);
    if (result.violations.length > 0) {
      throw new Error(
        `Найдены проблемы с контрастом:\n${JSON.stringify(result.violations, null, 2)}`,
      );
    }
  }

  return true;
}
