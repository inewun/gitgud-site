/**
 * Единая точка инициализации и экспорта всех сторов Zustand
 * Сюда следует добавлять все новые сторы при разработке
 */

// Реэкспорт всех сторов
export * from './useAnonymizeStore';

// Тип для доступа ко всем сторам в приложении
export interface StoreState {
  anonymize: ReturnType<typeof import('./useAnonymizeStore').useAnonymizeStore>;
  // Добавляйте новые сторы здесь в таком же формате
}
