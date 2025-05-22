import { router } from '../trpc';

import { anonymizeRouter } from './anonymize';

/**
 * Корневой маршрутизатор приложения
 *
 * Объединяет все подмаршрутизаторы API в единую структуру
 * Подмаршрутизаторы добавляются с помощью merge()
 */
export const appRouter = router({
  anonymize: anonymizeRouter,
  // Здесь можно добавить другие подмаршрутизаторы, например:
  // users: usersRouter,
  // auth: authRouter,
  // settings: settingsRouter,
});

/**
 * Экспорт типа корневого маршрутизатора
 * Используется на клиенте для типизации запросов
 */
export type AppRouter = typeof appRouter;
