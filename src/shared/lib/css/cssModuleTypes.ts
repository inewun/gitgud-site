/**
 * Строгая типизация для CSS модулей
 * Позволяет TypeScript проверять, что используемые CSS классы действительно существуют
 *
 * @example
 * // Файл: Button.module.css
 * // .primary { color: blue; }
 * // .secondary { color: gray; }
 * // .large { font-size: 1.5rem; }
 *
 * // Файл: Button.tsx
 * import styles from './Button.module.css';
 * import { createTypedStyles } from '@/shared/lib/css/cssModuleTypes';
 *
 * // Создаем типизированную версию стилей
 * const typedStyles = createTypedStyles<
 *   'primary' | 'secondary' | 'large'
 * >(styles);
 *
 * // TypeScript выдаст ошибку, если используется несуществующий класс
 * const className = typedStyles.primary; // ✅ OK
 * const errorClass = typedStyles.medium; // ❌ Error: Property 'medium' does not exist
 */
export function createTypedStyles<K extends string>(
  styles: Record<string, string>,
): Record<K, string> {
  return styles as Record<K, string>;
}

/**
 * Тип для модульных CSS файлов
 * Используется для строгой типизации импортированных CSS модулей
 *
 * @example
 * // Файл: theme.types.ts
 * export type ButtonStyles = CSSModule<'primary' | 'secondary' | 'outline' | 'disabled'>;
 *
 * // Файл: Button.tsx
 * import styles from './Button.module.css';
 * import type { ButtonStyles } from './theme.types';
 *
 * // Проверка типов при использовании
 * const typedStyles = styles as ButtonStyles;
 * const className = typedStyles.primary; // ✅ OK
 * const errorClass = typedStyles.invalid; // ❌ Error: Property 'invalid' does not exist
 */
export type CSSModule<K extends string> = {
  [key in K]: string;
};

/**
 * Валидатор для проверки соответствия CSS модуля ожидаемым классам
 * Проверяет во время выполнения, что все необходимые классы присутствуют
 *
 * @param styles - Импортированный CSS модуль
 * @param requiredClasses - Массив обязательных классов
 * @returns CSS модуль с проверенными классами
 * @throws Error, если какой-то класс отсутствует
 *
 * @example
 * // Проверяем наличие всех необходимых классов во время выполнения
 * const validatedStyles = validateCSSModule(styles, ['primary', 'secondary', 'large']);
 *
 * // Безопасное использование стилей
 * const className = validatedStyles.primary;
 */
export function validateCSSModule<K extends string>(
  styles: Record<string, string>,
  requiredClasses: K[],
): CSSModule<K> {
  const missingClasses = requiredClasses.filter(className => !(className in styles));

  if (missingClasses.length > 0) {
    throw new Error(`CSS Module validation failed. Missing classes: ${missingClasses.join(', ')}`);
  }

  return styles as CSSModule<K>;
}

/**
 * Тип для CSS модуля с вариантами
 * Позволяет организовать CSS классы в группы по назначению
 *
 * @example
 * // Определение типов для CSS модуля
 * type ButtonVariants = {
 *   variant: 'primary' | 'secondary' | 'outline';
 *   size: 'small' | 'medium' | 'large';
 *   state: 'default' | 'hover' | 'active' | 'disabled';
 * };
 *
 * // Типизированный импорт CSS модуля
 * import styles from './Button.module.css';
 * import { CSSModuleWithVariants } from '@/shared/lib/css/cssModuleTypes';
 *
 * const buttonStyles = styles as CSSModuleWithVariants<ButtonVariants>;
 *
 * // Использование с проверкой типов
 * const className = buttonStyles.variant.primary; // ✅ OK
 * const sizeClass = buttonStyles.size.medium; // ✅ OK
 * const errorClass = buttonStyles.variant.ghost; // ❌ Error: Property 'ghost' does not exist
 */
export type CSSModuleWithVariants<T extends Record<string, string>> = {
  [Category in keyof T]: {
    [Variant in T[Category]]: string;
  };
};

/**
 * Создает типизированную обертку для CSS модуля с вариантами
 *
 * @param styles - Импортированный CSS модуль
 * @param structure - Объект с описанием структуры вариантов
 * @returns Типизированный CSS модуль с вариантами
 *
 * @example
 * // Импорт CSS модуля
 * import styles from './Button.module.css';
 *
 * // Создание типизированной обертки
 * const buttonStyles = createStyledVariants(styles, {
 *   variant: ['primary', 'secondary', 'outline'],
 *   size: ['small', 'medium', 'large'],
 *   state: ['default', 'hover', 'active', 'disabled']
 * });
 *
 * // Типобезопасное использование
 * const className = `${buttonStyles.variant.primary} ${buttonStyles.size.medium}`;
 */
export function createStyledVariants<T extends Record<string, readonly string[]>>(
  styles: Record<string, string>,
  structure: T,
): {
  [Category in keyof T]: {
    [Variant in T[Category][number]]: string;
  };
} {
  // Создаем типизированный объект
  const result = Object.entries(structure).reduce<Record<string, Record<string, string>>>(
    (acc, [category, variants]) => {
      const categoryKey = category;
      // Инициализируем категорию с пустым объектом
      acc[categoryKey] = {};

      // Добавляем все варианты для текущей категории
      for (const variant of variants) {
        const fullClassName = `${category}_${variant}`;
        const className = styles[fullClassName];

        if (!className) {
          // eslint-disable-next-line no-console
          console.warn(`CSS class '${fullClassName}' not found in CSS module`);
        }

        // Безопасно устанавливаем значение для варианта
        acc[categoryKey][variant] = className || '';
      }

      return acc;
    },
    {},
  );

  // Приводим результат к нужному типу в конце функции
  return result as {
    [Category in keyof T]: {
      [Variant in T[Category][number]]: string;
    };
  };
}

/**
 * Хелпер для безопасного доступа к CSS модулям
 * Возвращает класс из CSS модуля, если он существует, или пустую строку
 *
 * @param styles - CSS модуль
 * @param className - Имя класса
 * @returns CSS класс или пустая строка
 *
 * @example
 * // Безопасный доступ к классам
 * import styles from './Component.module.css';
 *
 * const primary = safeCSSClass(styles, 'primary'); // Вернет класс или ''
 * const className = safeCSSClass(styles, 'nonExistent'); // Вернет ''
 */
export function safeCSSClass(
  styles: Record<string, string> | undefined,
  className: string,
): string {
  if (!styles) {
    return '';
  }

  return styles[className] || '';
}

/**
 * Хелпер для условного применения CSS классов
 *
 * @param styles - CSS модуль
 * @param classMap - Объект, где ключи - имена классов, а значения - условия применения
 * @returns Строка с классами, для которых условия истинны
 *
 * @example
 * // Условное применение классов
 * import styles from './Button.module.css';
 *
 * const className = conditionalClasses(styles, {
 *   primary: variant === 'primary',
 *   large: size === 'large',
 *   disabled: isDisabled
 * });
 */
export function conditionalClasses(
  styles: Record<string, string>,
  classMap: Record<string, boolean>,
): string {
  return Object.entries(classMap)
    .filter(([_, condition]) => Boolean(condition))
    .map(([className]) => safeCSSClass(styles, className))
    .filter(Boolean)
    .join(' ');
}
