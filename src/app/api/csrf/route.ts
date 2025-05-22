import { NextResponse } from 'next/server';

import { generateCSRFToken } from '@/lib/utils/csrf';

/**
 * Маршрут для инициализации CSRF токена
 * При GET запросе создает новый токен и устанавливает куки
 */
export async function GET() {
  // Добавляем искусственное ожидание, чтобы функция содержала await
  await Promise.resolve();

  // Генерируем новый CSRF токен
  generateCSRFToken();

  return new NextResponse(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
