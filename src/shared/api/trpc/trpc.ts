import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { type Context } from './context';
import { transformer } from './transformer';

/**
 * Инициализация базового API роутера с контекстом
 */
const t = initTRPC.context<Context>().create({
  /**
   * Сериализатор для передачи complex types через API
   * SuperJSON поддерживает даты, Map, Set и другие структуры данных
   */
  transformer: superjson,

  /**
   * Обработка ошибок с добавлением дополнительной информации
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Middleware для проверки авторизации пользователя
 * Выбрасывает ошибку, если пользователь не авторизован
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // Включаем данные пользователя и сессии в контекст
      session: ctx.session,
      user: ctx.user,
    },
  });
});

/**
 * Создание защищенных администраторских процедур
 */
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Требуется авторизация для доступа к этой процедуре',
    });
  }

  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Недостаточно прав для доступа к этой процедуре',
    });
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
    },
  });
});

/**
 * Экспортируем компоненты для построения API
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

/**
 * Типы для использования на клиенте
 */
export type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';

/**
 * Экспортируем дополнительные типы ошибок для клиента
 */
export { TRPCError };
export { transformer };
