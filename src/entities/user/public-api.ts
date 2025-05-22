/**
 * Public API для сущности "Пользователь"
 *
 * Этот файл экспортирует все публичные компоненты, хуки и типы
 * для использования в других слайсах приложения.
 */

// Модели данных и типы
export type { User, UserPreferences } from './model/types';

// Селекторы и хуки
export { useUser } from './model/selectors';

// UI компоненты
export { UserProfile } from './ui/UserProfile';
export { UserAvatar } from './ui/UserAvatar';

// Слайс для хранилища
export { userSlice, userActions } from './model/slice';
