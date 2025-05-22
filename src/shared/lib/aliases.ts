/**
 * Соглашения по импортам
 *
 * В проекте используется только алиас @/ для всех импортов
 *
 * Примеры правильных импортов:
 *
 * import { Button } from '@/shared/ui/inputs/button';
 * import { anonymizeText } from '@/domain/anonymize/model';
 * import { useSomeHook } from '@/shared/lib/hooks';
 *
 * НЕПРАВИЛЬНО (не используйте):
 * ❌ import { Button } from '@/shared/ui';
 * ❌ import { anonymizeText } from 'domain/anonymize';
 * ❌ import SomeComponent from '../../../components/SomeComponent';
 */

/**
 * Файл содержит стандартизированные алиасы для FSD архитектуры
 */

/**
 * Слои архитектуры FSD
 */
export const FSD_LAYERS = {
  // Уровень приложения
  APP: '@app',

  // Интеграционные слои
  PAGES: '@pages',
  WIDGETS: '@widgets',

  // Бизнес-логика
  FEATURES: '@features',
  ENTITIES: '@entities',
  DOMAIN: '@domain',

  // Инфраструктура
  SHARED: '@shared',
  LIB: '@lib',
  STYLES: '@styles',
};

/**
 * Стили мы рекомендуем импортировать через композиции
 *
 * ```typescript
 * import { typography, layout } from '@/styles/compositions';
 * ```
 */

export const getExampleImport = () => {
  return '@/shared/ui/Button';
};
