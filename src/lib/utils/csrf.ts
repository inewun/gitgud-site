import { randomBytes, createHash } from 'crypto';

import { cookies } from 'next/headers';

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-key-change-this-in-production';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 час в миллисекундах

/**
 * Генерирует новый CSRF токен и сохраняет его в куке
 * @returns Объект с CSRF токеном
 */
export function generateCSRFToken() {
  // Генерируем случайный токен
  const randomToken = randomBytes(32).toString('hex');

  // Создаем хеш токена с секретным ключом
  const csrfToken = createTokenHash(randomToken);

  // Устанавливаем куку с токеном
  const cookieStore = cookies();
  cookieStore.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CSRF_TOKEN_EXPIRY / 1000, // В секундах для куки
  });

  // Устанавливаем вторую куку, доступную в JavaScript, без фактического значения токена
  // Эта кука только сигнализирует, что токен существует, без раскрытия значения
  cookieStore.set(`${CSRF_COOKIE_NAME}_exists`, '1', {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    httpOnly: false, // Доступна для JavaScript
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
  });

  return { csrfToken };
}

/**
 * Проверяет CSRF токен из запроса с токеном из куков
 * @param requestToken CSRF токен из запроса (заголовка или формы)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
 * @returns true если токен валидный, false в противном случае
 */
export function validateCSRFToken(requestToken: string): boolean {
  if (!requestToken) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return false;
  }

  // Получаем токен из куки
  const cookieStore = cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!cookieToken) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return false;
  }

  // Сравниваем токены
  return requestToken === cookieToken;
}

/**
 * Создает хеш токена с секретным ключом
 * @param token Исходный токен
 * @returns Хешированный токен
 */
function createTokenHash(token: string): string {
  return createHash('sha256').update(`${token}${CSRF_SECRET}`).digest('hex');
}

/**
 * Middleware для проверки CSRF токенов в API запросах
 * @param request Запрос
 * @returns Объект с флагом валидности токена
 */
export async function csrfMiddleware(request: Request) {
  // Проверяем только для методов, изменяющих данные
  const method = request.method.toUpperCase();

  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return { isValid: true };
  }

  // Получаем токен из заголовка
  const csrfToken = request.headers.get(CSRF_HEADER_NAME);

  if (!csrfToken) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return { isValid: false, error: 'CSRF токен отсутствует' };
  }

  // Проверяем токен с задержкой для имитации асинхронной операции
  const isValid = await Promise.resolve(validateCSRFToken(csrfToken));

  return {
    isValid,
    error: isValid ? undefined : 'Недействительный CSRF токен',
  };
}
