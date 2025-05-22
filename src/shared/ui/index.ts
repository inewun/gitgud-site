/* eslint-disable import/no-cycle */

// Barrel-файл для экспорта UI-компонентов
// Экспорты сгруппированы по категориям для лучшей поддерживаемости и оптимизации бандла

// Реэкспорт компонентов по категориям
export * from './inputs';
export * from './navigation';
export * from './media';
export * from './layout';
export * from './typography';
export * from './feedback';
export * from './utils';
export * from './theme';

// Экспорт утилит из styles для совместимости
export {
  typography,
  spacing,
  layout,
  cards,
  formVariants,
  animations,
  transitions,
  accessibility,
  responsive,
} from '@/styles/common';

// Убираем индивидуальные экспорты компонентов,
// так как они уже включены в групповые экспорты выше
