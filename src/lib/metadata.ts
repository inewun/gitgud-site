import type { Metadata, Viewport } from 'next';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonicalUrl?: string;
  robots?: string;
}

export const baseMetadata: Metadata = {
  title: {
    default: 'Анонимизатор данных',
    template: '%s | Анонимизатор данных',
  },
  description:
    'Инструмент для анонимизации конфиденциальных данных с интуитивно понятным интерфейсом',
  keywords: ['анонимизация', 'приватность', 'данные', 'безопасность', 'конфиденциальность'],
  authors: [{ name: 'Команда анонимизатора' }],
  openGraph: {
    title: 'Анонимизатор данных',
    description: 'Инструмент для защиты персональных данных в тексте',
    type: 'website',
    url: 'https://anonymize-tool.example.com',
    siteName: 'Анонимизатор данных',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Анонимизатор данных',
    description: 'Инструмент для защиты персональных данных',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
    shortcut: '/shortcut-icon.png',
  },
};

export const baseViewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
};

export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const { title, description, keywords, image, canonicalUrl, robots } = options;

  const metadata: Metadata = { ...baseMetadata };

  if (title) {
    metadata.title = title;
  }

  if (description) {
    metadata.description = description;
    if (metadata.openGraph) {
      metadata.openGraph.description = description;
    }
    if (metadata.twitter) {
      metadata.twitter.description = description;
    }
  }

  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords;
  }

  if (image && metadata.openGraph) {
    metadata.openGraph.images = [{ url: image }];
  }

  if (image && metadata.twitter) {
    metadata.twitter.images = [{ url: image }];
  }

  if (canonicalUrl) {
    metadata.alternates = {
      canonical: canonicalUrl,
    };
  }

  if (robots) {
    metadata.robots = robots;
  }

  return metadata;
}
