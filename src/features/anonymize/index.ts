/**
 * Точка входа для фичи "Анонимизация данных"
 *
 * Этот файл экспортирует все публичные компоненты, хуки и типы
 * для использования в других слайсах приложения.
 */

// UI компоненты
export { AnonymizeForm, AnonymizeErrorDisplay, LazyResultsList } from './ui/components';

// Типы
export type { AnonymizeError } from './api/anonymize.service';
export type { UseAnonymizeOptions, AnonymizeResult } from './model/Types';

// Утилиты
export * from './model/TextUtils';
export * from './model/Metadata';

// Серверные действия
export { anonymizeText } from './actions';

// Хуки
export { useAnonymization } from './hooks/useAnonymization';
