import { inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';

/**
 * Интерфейс данных пользователя
 */
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: 'user' | 'admin';
}

/**
 * Функция для создания контекста tRPC на основе запроса Next.js
 *
 * @param opts - Опции контекста из Next.js
 * @returns Контекст с информацией о пользователе и сессии
 *
 * Эта функция выполняется для каждого входящего запроса
 * и устанавливает необходимый контекст для tRPC процедур.
 */
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Получаем сессию из NextAuth
  const session = await getSession({ req });

  // Получаем информацию о пользователе из сессии
  const user = session?.user as User | undefined;

  return {
    req,
    res,
    session,
    user,
  };
};

/**
 * Тип контекста, выведенный из функции создания контекста
 */
export type Context = inferAsyncReturnType<typeof createContext>;

/**
 * Вспомогательная функция для создания контекста без запроса
 * Используется для интеграционного тестирования и внутренних вызовов
 *
 * @param user - Данные пользователя
 * @returns Контекст с заданным пользователем
 */
export function createInnerTRPCContext(user?: User) {
  return {
    user,
    session: user ? { user } : null,
  };
}
