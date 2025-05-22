/**
 * Генератор структурированных данных JSON-LD для улучшения SEO
 */

type Organization = {
  type: 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
};

type WebSite = {
  type: 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    type: string;
    target: string;
    'query-input': string;
  };
};

type WebPage = {
  type: 'WebPage';
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    type: 'Person';
    name: string;
  };
};

type Article = {
  type: 'Article';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    type: 'Person';
    name: string;
  };
  publisher: {
    type: 'Organization';
    name: string;
    logo: {
      type: 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    type: 'WebPage';
    id: string;
  };
};

type BreadcrumbList = {
  type: 'BreadcrumbList';
  itemListElement: Array<{
    type: 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

type JsonLDType = Organization | WebSite | WebPage | Article | BreadcrumbList;

/**
 * Генерирует структурированные данные JSON-LD для SEO
 * @param data - Данные для генерации JSON-LD
 * @returns Объект JSON-LD
 */
export const jsonLDGenerator = (data: JsonLDType): unknown => {
  const { type, ...rest } = data;

  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...rest,
  };
};

/**
 * Генерирует хлебные крошки в формате JSON-LD
 * @param items - Элементы хлебных крошек
 * @returns Объект JSON-LD с хлебными крошками
 */
export const generateBreadcrumbsLD = (items: Array<{ name: string; url: string }>): unknown => {
  return jsonLDGenerator({
    type: 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      type: 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
};

/**
 * Генерирует JSON-LD для статьи
 * @param article - Данные статьи
 * @returns Объект JSON-LD для статьи
 */
export const generateArticleLD = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  url: string;
}): unknown => {
  return jsonLDGenerator({
    type: 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      type: 'Person',
      name: article.authorName,
    },
    publisher: {
      type: 'Organization',
      name: article.publisherName,
      logo: {
        type: 'ImageObject',
        url: article.publisherLogo,
      },
    },
    mainEntityOfPage: {
      type: 'WebPage',
      id: article.url,
    },
  });
};
