/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Проверка переменных окружения перед запуском приложения
if (process.env.NODE_ENV === 'production') {
  try {
    // Динамический импорт, чтобы избежать ошибок при сборке
    const { checkRequiredEnvVars } = await import('./src/lib/env-check.js');
    checkRequiredEnvVars();
    console.log('✅ Проверка переменных окружения выполнена успешно');
  } catch (error) {
    console.error('❌ Ошибка проверки переменных окружения:', error.message);
    // В production режиме выходим с ошибкой для предотвращения запуска приложения
    // с отсутствующими обязательными переменными окружения
    if (process.env.IGNORE_ENV_CHECK !== 'true') {
      process.exit(1);
    } else {
      console.warn(
        '⚠️ Игнорирование ошибок проверки переменных окружения из-за флага IGNORE_ENV_CHECK',
      );
    }
  }
}

const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? import('@/next/bundle-analyzer')({
        enabled: true,
      })
    : config => config;

// Настройки CSP (Content Security Policy)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://*.googleusercontent.com https://*.google-analytics.com;
  font-src 'self';
  connect-src 'self' https://*.google-analytics.com https://*.googleapis.com;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`;

// Удаление переносов строк и лишних пробелов для корректной работы CSP
const cspHeaderValue = ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim();

const nextConfig = {
  reactStrictMode: true,
  // Для создания standalone билда
  output: 'standalone',
  // Включаем проверки для production-сборки
  typescript: {
    // Отключаем только для разработки
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Отключаем только для разработки
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  // Настройка HTTP/2 push для критических ресурсов
  async rewrites() {
    return [
      // Все запросы обрабатываются с добавлением HTTP/2 push подсказок
      {
        source: '/:path*',
        destination: '/:path*',
        has: [{ type: 'header', key: 'x-middleware-rewrite', value: '(?<rewrite>.*)' }],
      },
    ];
  },
  // Полная настройка Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeaderValue,
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
