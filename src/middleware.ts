import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Название куки для CSRF токена
const CSRF_COOKIE_NAME = 'csrf-token';
// Название заголовка для CSRF токена
const CSRF_HEADER_NAME = 'x-csrf-token';
// Срок действия CSRF токена в секундах
const CSRF_TOKEN_EXPIRY = 60 * 60; // 1 час

/**
 * Генерация криптографически стойкого nonce для CSP
 * Используем 128 бит (16 байт) случайных данных для обеспечения уникальности
 */
function generateCSPNonce(): string {
  // Создаем массив случайных байтов с помощью Web Crypto API
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  // Конвертируем в base64
  return btoa(String.fromCharCode(...array));
}

/**
 * Валидирует nonce значение, чтобы предотвратить инъекции
 * Nonce должен быть base64-encoded строкой длиной 24 символа
 */
function validateNonce(nonce: string): boolean {
  // Проверяем, что nonce имеет правильную длину для 16 байт в base64 (24 символа с padding)
  if (nonce.length !== 24) return false;

  // Проверяем, что nonce содержит только допустимые base64 символы
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(nonce)) return false;

  // Дополнительная проверка на XSS-инъекции
  const dangerousChars = /[<>"']/;
  if (dangerousChars.test(nonce)) return false;

  return true;
}

/**
 * Генерирует безопасное значение Content-Security-Policy с nonce
 */
function generateCSP(nonce: string): string {
  // Валидируем nonce перед использованием
  if (!validateNonce(nonce)) {
    // eslint-disable-next-line no-console
    console.error('Недействительное значение nonce, генерируем новое');
    nonce = generateCSPNonce();
  }

  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : '', // Необходимо только в режиме разработки
      `'nonce-${nonce}'`,
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://ssl.google-analytics.com',
    ].filter(Boolean),
    'style-src': [
      "'self'",
      `'nonce-${nonce}'`, // Заменяем 'unsafe-inline' на nonce-based подход
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://stats.g.doubleclick.net',
    ],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://stats.g.doubleclick.net',
      'https://region1.google-analytics.com',
    ],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'frame-src': ["'self'", 'https://www.google.com', 'https://www.youtube.com'],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
  };

  return Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Генерирует CSRF токен и добавляет его в куки
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Хэширует CSRF токен
 */
async function hashCSRFToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Добавляет заголовки безопасности к ответу
 */
function addSecurityHeaders(response: NextResponse): void {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // Устанавливаем заголовки безопасности в ответ
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * Добавляет заголовки кеширования в зависимости от типа ресурса
 */
function addCachingHeaders(response: NextResponse, url: string): void {
  // Определяем статические ресурсы по расширению файла
  const isStaticResource = /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/.test(url);
  const isPublicResource = url.startsWith('/public/') || url.startsWith('/_next/static/');

  if (isStaticResource || isPublicResource) {
    // Устанавливаем Cache-Control для статических ресурсов
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url === '/' || /^\/[^._]+$/.test(url)) {
    // Для HTML страниц (не нужно длительное кеширование)
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, s-maxage=60, stale-while-revalidate=86400',
    );
  }
}

/**
 * Обрабатывает CSP и nonce
 */
function handleCSP(request: NextRequest, response: NextResponse): void {
  // Генерируем nonce для CSP и храним его в контексте запроса
  const requestNonce = request.headers.get('x-nonce');

  // Если nonce уже есть в запросе, валидируем его
  // Иначе, генерируем новый
  let nonce: string;
  if (requestNonce && validateNonce(requestNonce)) {
    nonce = requestNonce;
  } else {
    nonce = generateCSPNonce();
  }

  // Сохраняем nonce для следующих запросов - делаем синхронно
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);

  // Вместо асинхронного crypto.subtle.digest, используем синхронную функцию
  // Простой хэш для нужд безопасности nonce
  let nonceHash = '';
  for (let i = 0; i < data.length; i++) {
    nonceHash += data[i].toString(16).padStart(2, '0');
  }

  // Устанавливаем CSP заголовок с безопасным nonce
  const cspHeader = generateCSP(nonce);
  response.headers.set('Content-Security-Policy', cspHeader);

  // Сохраняем nonce в заголовке для использования в приложении
  // Храним хэш в куки для проверки подлинности nonce
  response.headers.set('x-nonce', nonce);
  response.cookies.set('x-nonce-hash', nonceHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 час
  });
}

/**
 * Обрабатывает CSRF токены
 */
async function handleCSRF(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse | undefined> {
  // Генерируем и устанавливаем CSRF токен для всех GET запросов
  if (request.method === 'GET') {
    // Проверяем есть ли уже токен в куки
    const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

    if (!existingToken) {
      // Генерируем новый токен
      const token = generateCSRFToken();
      // Хэшируем для сравнения
      const hashedToken = await hashCSRFToken(token);

      // Устанавливаем куки с хэшированным токеном
      response.cookies.set({
        name: CSRF_COOKIE_NAME,
        value: hashedToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: CSRF_TOKEN_EXPIRY,
      });

      // Добавляем заголовок с исходным токеном для фронтенда
      response.headers.set(CSRF_HEADER_NAME, token);
    }
    return undefined;
  } else if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    // Проверяем CSRF токен для небезопасных методов
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!cookieToken || !headerToken) {
      return new NextResponse('Отсутствует CSRF токен', { status: 403 });
    }

    // Хэшируем полученный токен для сравнения
    const hashedHeaderToken = await hashCSRFToken(headerToken);

    // Сравниваем токены
    if (hashedHeaderToken !== cookieToken) {
      return new NextResponse('Недействительный CSRF токен', { status: 403 });
    }
  }

  return undefined;
}

/**
 * Middleware для добавления заголовков безопасности и обработки CSRF
 */
export async function middleware(request: NextRequest) {
  // Создаем клон исходного ответа
  const response = NextResponse.next();

  // Добавляем заголовки безопасности (это быстрая операция)
  addSecurityHeaders(response);

  // Обрабатываем CSP (синхронная операция)
  handleCSP(request, response);

  // Обрабатываем CSRF токены (асинхронная операция)
  const csrfResponse = await handleCSRF(request, response);
  if (csrfResponse) {
    return csrfResponse;
  }

  // Добавляем заголовки кеширования
  const { pathname } = request.nextUrl;
  addCachingHeaders(response, pathname);

  // Возвращаем окончательный ответ
  return response;
}

export const config = {
  matcher: [
    /*
     * Совпадает с любыми путями, кроме:
     * 1. Любые пути API (/api/*)
     * 2. Все статические файлы, включая Next.js встроенные файлы
     *    (.+\\..+) => any file with extension
     *    (/_next) => все внутренние Next.js файлы
     * 3. Файлы _next/static (статические ресурсы Next.js)
     * 4. Файлы _next/image (оптимизация изображений Next.js)
     * 5. Файлы favicon.ico, apple-icon.png, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
