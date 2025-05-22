import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import React, { Suspense } from 'react';

import { clsx } from 'clsx';

import { baseViewport } from '@/lib/metadata';
import '@/styles/globals.css';
import '@/styles/critical.css';
import { SkipLink } from '@/shared/ui';
import { FooterPlaceholder } from '@/shared/ui/layout/footer/FooterPlaceholder';
import { Header } from '@/widgets/header/ui/Header';
import { ThemeProvider } from '@/shared/ui/theme/providers';
import { Footer } from '@/widgets/footer/ui/Footer';

// Загрузка шрифтов
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const Analytics = dynamic(() => import('@/shared/ui/utils/analytics/Analytics'), { ssr: false });
const DynamicAccessibilitySettings = dynamic(
  () => import('@/shared/ui/utils/accessibility/AccessibilitySettings'),
  { ssr: false },
);
const MobileTextStyles = dynamic(
  () => import('@/shared/ui/utils/MobileTextStyles').then(mod => mod.MobileTextStyles),
  { ssr: false },
);

// Типизированный доступ к DOMPurify
interface DOMPurifyType {
  sanitize: (input: string, config?: object) => string;
}

// Для серверного рендеринга возвращаем заглушку
const DOMPurify: DOMPurifyType = {
  sanitize: (html: string) => html,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Анонимизатор текста',
    default: 'Анонимизатор текста - защита персональных данных',
  },
  description: 'Быстрая и безопасная анонимизация текстов с персональными данными',
  keywords: ['анонимизация', 'конфиденциальность', 'персональные данные', 'обработка текста'],
  authors: [{ name: 'Команда разработки', url: 'https://github.com/example/anonymizer' }],
  creator: 'Анонимизатор',
  publisher: 'Анонимизатор',
  robots: 'index, follow',
};

export const viewport = {
  ...baseViewport,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
  colorScheme: 'light dark',
};

function generateSchemaOrgData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Анонимизатор текста',
    description: 'Инструмент для быстрой и безопасной анонимизации текстов с персональными данными',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Анонимизатор',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  return (
    <html
      lang="ru"
      className={clsx('scroll-smooth', inter.variable, theme === 'dark' ? 'dark' : '')}
      suppressHydrationWarning
      data-theme={theme}
    >
      <head>
        {/* Заголовок CSP будет добавлен через middleware */}

        {/* Оптимизированный скрипт предотвращения мерцания темы */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Добавляем атрибут для блокировки начального отображения
                  document.documentElement.setAttribute('data-theme-initializing', 'true');
                  
                  // Определяем тему на основе локального хранилища или системных настроек
                  const savedTheme = localStorage.getItem('theme');
                  
                  // Проверяем наличие сохраненной темы, иначе используем системные настройки
                  let resolvedTheme;
                  if (savedTheme === 'dark' || savedTheme === 'light') {
                    resolvedTheme = savedTheme;
                  } else if (savedTheme === 'system' || !savedTheme) {
                    // Используем системные настройки, если тема не указана или установлена как 'system'
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } else {
                    // Значение по умолчанию
                    resolvedTheme = 'light';
                  }
                  
                  const isDark = resolvedTheme === 'dark';
                  
                  // Применяем соответствующие классы и атрибуты
                  document.documentElement.classList.toggle('dark', isDark);
                  document.documentElement.setAttribute('data-theme', resolvedTheme);
                  
                  // Добавляем класс для блокировки анимаций при загрузке
                  document.documentElement.classList.add('theme-init');
                  
                  // Добавляем обработчик для изменения системной темы
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  mediaQuery.addEventListener('change', (e) => {
                    // Применяем системную тему только если установлена опция 'system'
                    if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
                      const newTheme = e.matches ? 'dark' : 'light';
                      document.documentElement.classList.toggle('dark', e.matches);
                      document.documentElement.setAttribute('data-theme', newTheme);
                    }
                  });
                  
                  // Убираем блокировку отображения после загрузки DOM
                  window.addEventListener('DOMContentLoaded', () => {
                    // Сначала убираем блокировку отображения
                    document.documentElement.removeAttribute('data-theme-initializing');
                    
                    // Затем плавно удаляем блокировку анимаций
                    setTimeout(() => {
                      document.documentElement.classList.remove('theme-init');
                      document.documentElement.classList.add('theme-transition');
                    }, 50);
                  });
                } catch (e) {
                  // В случае ошибки убираем блокировку отображения
                  document.documentElement.removeAttribute('data-theme-initializing');
                  console.error('Theme init error:', e);
                }
              })();
            `,
          }}
        />

        {/* Подключаем иконку для сайта */}
        <link rel="icon" href="/favicon.ico" />

        {/* Подключаем preconnect для внешних ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Скрипт schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(generateSchemaOrgData())),
          }}
          nonce="%%NONCE%%"
        />
      </head>

      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="theme"
          forcedTheme={undefined}
          enableColorScheme
          disableTransitionOnChange={false}
        >
          <SkipLink targetId="main-content" />

          <div className="relative overflow-hidden min-h-screen flex flex-col">
            <Header />

            <main
              id="main-content"
              className="flex-1 relative z-10 pt-20"
              tabIndex={-1}
              aria-live="polite"
            >
              {children}
            </main>

            <Suspense fallback={<FooterPlaceholder />}>
              <Footer />
            </Suspense>

            {/* Аналитика и другие несрочные компоненты */}
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>

            {/* Компонент настроек доступности */}
            <Suspense fallback={null}>
              <DynamicAccessibilitySettings />
            </Suspense>
            
            {/* Компонент для адаптивных стилей текста на мобильных */}
            <Suspense fallback={null}>
              <MobileTextStyles />
            </Suspense>
          </div>

          {/* Поддержка для нон-критических стилей */}
          <Script id="load-non-critical-css" nonce="%%NONCE%%">
            {`
              // Здесь может быть ваш код для загрузки дополнительных стилей
            `}
          </Script>

          {/* Скрипт для исправления доступности диалогов NextJS */}
          <Script id="fix-next-dialog-a11y" strategy="afterInteractive" nonce="%%NONCE%%">
            {`
              (function fixNextJSDialogAccessibility() {
                if (typeof window !== 'undefined') {
                  window.addEventListener('DOMContentLoaded', () => {
                    const observer = new MutationObserver((mutations) => {
                      mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length) {
                          fixDialogs();
                        }
                      });
                    });
                    
                    observer.observe(document.body, { childList: true, subtree: true });
                    
                    function fixDialogs() {
                      // Находим все диалоги, которые могут быть добавлены Next.js
                      const dialogs = document.querySelectorAll('[role="dialog"]');
                      
                      dialogs.forEach((dialog) => {
                        // Проверяем, есть ли у диалога labelledby или describedby
                        if (!dialog.hasAttribute('aria-labelledby') && !dialog.hasAttribute('aria-label')) {
                          // Пытаемся найти заголовок внутри диалога
                          const heading = dialog.querySelector('h1, h2, h3, h4, h5, h6');
                          
                          if (heading && !heading.id) {
                            // Генерируем уникальный ID для заголовка
                            const headingId = \`dialog-title-\${Math.random().toString(36).substring(2, 11)}\`;
                            heading.id = headingId;
                            
                            // Устанавливаем связь между диалогом и заголовком
                            dialog.setAttribute('aria-labelledby', headingId);
                          } else if (heading && heading.id) {
                            // Используем существующий ID
                            dialog.setAttribute('aria-labelledby', heading.id);
                          } else {
                            // Если заголовка нет, устанавливаем базовую метку
                            dialog.setAttribute('aria-label', 'Диалоговое окно');
                          }
                        }
                      });
                    }
                  });
                }
              })();
            `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}
