import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

export default {
  logo: (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
      </div>
      <span className="font-medium">Anonymize Tool</span>
    </div>
  ),
  project: {
    link: 'https://github.com/username/anonymize-tool',
  },
  docsRepositoryBase: 'https://github.com/username/anonymize-tool/blob/main',
  footer: {
    text: (
      <div className="flex items-center justify-center gap-2 text-sm">
        <span>© 2025 Anonymize Tool</span>
        <span className="inline-block h-3 w-px bg-border mx-1" />
        <a href="/privacy" className="hover:text-primary transition-colors">Конфиденциальность</a>
        <span className="inline-block h-3 w-px bg-border mx-1" />
        <a href="/terms" className="hover:text-primary transition-colors">Условия использования</a>
      </div>
    ),
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    const { frontMatter } = useConfig();
    return {
      titleTemplate: '%s – Anonymize Tool',
      description: frontMatter.description || 'Инструмент для безопасной анонимизации данных',
      openGraph: {
        images: [{ url: frontMatter.image || '/og-image.png' }]
      }
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoGenerate: true,
    titleComponent: ({ title, type }) => {
      return type === 'separator' ? (
        <div className="flex items-center gap-2 mt-3 mb-1">
          <span className="opacity-50">{title}</span>
          <hr className="flex-1 border-t border-border" />
        </div>
      ) : (
        <>{title}</>
      );
    }
  },
  darkMode: true,
  primaryHue: {
    light: 225,
    dark: 215
  },
  navigation: {
    prev: true,
    next: true,
  },
  toc: {
    float: true,
    extraContent: (
      <div className="mt-8 pt-8 border-t border-border/40">
        <a
          href="https://github.com/username/anonymize-tool/issues/new"
          target="_blank"
          rel="noreferrer"
          className="text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Обратная связь
        </a>
      </div>
    )
  },
  banner: {
    key: '2025-release',
    text: <span>🚀 Версия 2025 уже доступна! <a href="/changelog">Узнать больше →</a></span>,
    dismissible: true
  },
  feedback: {
    content: 'Вопросы? Оставьте отзыв →',
    labels: 'feedback'
  },
  editLink: {
    text: 'Редактировать страницу на GitHub →'
  },
  search: {
    placeholder: 'Поиск в документации...'
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Anonymize Tool - инструмент для безопасной анонимизации данных" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111" />
    </>
  )
};
