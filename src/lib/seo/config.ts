/**
 * Конфигурация SEO для приложения
 */

export const defaultSEO = {
  title: 'Anonymizer - Безопасная анонимизация персональных данных',
  description:
    'Инструмент для безопасной анонимизации персональных данных в тексте, ' +
    'позволяющий защитить конфиденциальную информацию в документах.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://anonymizer.example.com',
    siteName: 'Anonymizer',
    images: [
      {
        url: 'https://anonymizer.example.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Anonymizer - сервис анонимизации данных',
      },
    ],
  },
  twitter: {
    handle: '@anonymizer',
    site: '@anonymizer',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'application-name',
      content: 'Anonymizer',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Anonymizer',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#6941C6',
    },
  ],
};
