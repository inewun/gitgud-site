/**
 * Точки останова (breakpoints) для отзывчивого дизайна
 * Определяют ширину экрана, при которой применяются различные стили
 */
export const breakpoints = {
  // Мобильные устройства (портрет)
  xs: '320px', // Минимальная ширина для поддержки
  sm: '640px', // Маленькие мобильные устройства

  // Планшеты и большие мобильные (ландшафт)
  md: '768px', // Средние устройства

  // Десктопы и ноутбуки
  lg: '1024px', // Базовая десктопная ширина
  xl: '1280px', // Широкие экраны
  '2xl': '1536px', // Очень широкие экраны
} as const;

/**
 * Создает медиа-запрос для указанной точки останова
 * @param size ключ точки останова
 * @returns строка с медиа-запросом, например '@media (min-width: 640px)'
 */
export function createMediaQuery(size: keyof typeof breakpoints): string {
  return `@media (min-width: ${breakpoints[size]})`;
}

/**
 * Готовые медиа-запросы для использования
 */
export const mediaQueries = {
  xs: createMediaQuery('xs'),
  sm: createMediaQuery('sm'),
  md: createMediaQuery('md'),
  lg: createMediaQuery('lg'),
  xl: createMediaQuery('xl'),
  '2xl': createMediaQuery('2xl'),
} as const;
