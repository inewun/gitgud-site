import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Маршрут для получения текущего CSRF токена
 * Возвращает токен из HttpOnly куки для использования в заголовках
 */
export async function GET() {
  await Promise.resolve();

  const cookieStore = cookies();
  const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME);
  const csrfToken = csrfCookie?.value;

  if (!csrfToken) {
    return new NextResponse(JSON.stringify({ error: 'CSRF токен не найден' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify({ token: csrfToken }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
