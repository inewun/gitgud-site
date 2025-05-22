# Anonymize Tool

![CI](https://github.com/fred-yagofarov1314/anonymize-tool/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Описание

Инструмент для анонимизации текстовых данных. Все вычисления происходят локально. Современный стек: React 18, Next.js 14, TypeScript, Tailwind CSS 4, FSD.

---

## Структура проекта (FSD + служебные директории)

```
Корень проекта
├── README.md                # Документация проекта
├── package.json             # Описание зависимостей и скриптов
├── .gitignore               # Исключения для git
├── tsconfig.json            # Конфигурация TypeScript
├── next.config.mjs          # Конфигурация Next.js
├── tailwind.config.ts       # Конфигурация Tailwind CSS
├── jest.config.ts           # Конфигурация Jest
├── playwright.config.ts     # Конфигурация Playwright
├── .eslintrc.js/.json       # Конфигурация ESLint
├── prettier.config.js       # Конфигурация Prettier
├── .vscode/                 # Настройки редактора (опционально)
├── .github/                 # GitHub Actions, шаблоны и т.д.
├── .husky/                  # Git hooks
├── public/                  # Статические файлы (иконки, изображения, локализация)
├── scripts/                 # Вспомогательные скрипты для разработки
├── e2e/                     # E2E тесты (Playwright)
├── test-results/            # Результаты тестов (игнорируется в git)
├── coverage/                # Покрытие тестов (игнорируется в git)
├── .next/                   # Сборка Next.js (игнорируется в git)
├── node_modules/            # Зависимости (игнорируется в git)
├── .swc/                    # Кэш компилятора (игнорируется в git)
└── src/                     # Исходный код (структура FSD)
```

### src/ — основная структура (Feature-Sliced Design)

```
src/
├── app/           # Точка входа, роутинг, провайдеры, layout, страницы
│   ├── components/      # Компоненты верхнего уровня
│   ├── api/             # API-роуты (Next.js)
│   ├── _layers/         # Вспомогательные слои
│   ├── anonymize/       # Страницы/роуты, связанные с анонимизацией
│   ├── tool/            # Страницы инструмента
│   ├── docs/            # Документация (страницы)
│   └── ...
├── features/      # Фичи (бизнес-функциональность, независимые модули)
│   ├── anonymize/
│   ├── map/
│   ├── data-visualizer/
│   ├── theme/
│   └── layout/
├── widgets/       # Композиционные блоки (сборка из фич и сущностей)
│   ├── anonymize/
│   ├── home/
│   ├── layout/
│   ├── footer/
│   └── header/
├── entities/      # Бизнес-сущности (user и др.)
│   └── user/
├── shared/        # Переиспользуемые модули, UI, утилиты, хуки
│   ├── hooks/
│   ├── ui/
│   ├── lib/
│   ├── providers/
│   ├── api/
│   └── stories/
├── domain/        # Бизнес-логика и модели
│   ├── anonymize/
│   ├── features/
│   └── text/
├── styles/        # Глобальные стили, токены, критические стили
│   ├── globals.css
│   ├── tokens.css
│   ├── tokens.animations.css
│   ├── theme-transition.css
│   ├── css-layers.css
│   ├── tokens.shadows.css
│   ├── focus.css
│   ├── critical.css
│   ├── high-contrast.css
│   ├── compositions/
│   ├── compositions.ts
│   ├── animations.ts
│   ├── variants.ts
│   ├── common.ts
│   ├── critical-css.ts
│   ├── breakpoints.ts
│   └── safelist-tailwindcss.txt
├── lib/           # Вспомогательные библиотеки, утилиты, константы, i18n
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── seo/
│   ├── constants/
│   ├── i18n/
│   ├── metadata.ts
│   ├── env-check.js/ts
│   ├── logger.ts
│   ├── i18n.ts
│   └── utils.ts
├── types/         # Глобальные типы и декларации
│   ├── framer-motion.d.ts
│   ├── variants.ts
│   ├── tailwind.d.ts
│   ├── anonymize.ts
│   └── accessibility.ts
├── store/         # Глобальное состояние (zustand и др.)
│   ├── useAnonymizeStore.ts
│   ├── index.ts
│   └── __tests__/
├── services/      # Сервисы для работы с API и бизнес-логикой
│   ├── anonymize.service.ts
│   ├── api.facade.ts
│   └── text.service.ts
├── locales/       # Локализация (json-файлы и папки для языков)
│   ├── ru/
│   ├── en/
│   └── ru.json
├── __tests__/     # Модульные тесты (Jest)
│   ├── Header.test.tsx
│   ├── ThemeToggle.test.tsx
│   ├── security.test.tsx
│   ├── anonymize.service.test.ts
│   ├── edge-cases.test.tsx
│   ├── Button.test.tsx
│   ├── color-contrast.test.tsx
│   ├── useTheme.test.tsx
│   └── utils/
├── docs/          # Документация по API, архитектуре, тестированию и т.д.
│   ├── api.md
│   ├── performance.md
│   ├── architecture.md
│   ├── accessibility-performance-audit.md
│   └── a11y-testing.md
└── scripts/       # Вспомогательные скрипты для src
    └── fix-next-dialog-a11y.js
```

> Временные и кэш-файлы (coverage/, .next/, node_modules/, .swc/, test-results/, playwright-report/) не хранятся в репозитории и игнорируются через .gitignore.

---

## Быстрый старт

```bash
pnpm install
pnpm dev
```
- Открыть: http://localhost:3000

### Сборка и запуск

```bash
pnpm build
pnpm start
```

---

## Основные скрипты

- `pnpm test` — модульные тесты (Jest)
- `pnpm test:coverage` — покрытие тестами (≥80% обязательно)
- `pnpm test:e2e` — e2e тесты (Playwright)
- `pnpm test:a11y` — тесты доступности
- `pnpm storybook` — документация компонентов
- `pnpm analyze` — аудит производительности (Lighthouse)
- `pnpm check-security` — аудит зависимостей

---

## Качество и автоматизация

- Покрытие тестами ≥ 80% (unit + e2e), проверяется в CI
- Все публичные UI-компоненты документируются в Storybook
- Lighthouse-аудит (performance, a11y, best practices, SEO ≥ 95)
- Контрастность и доступность (WCAG 2.1, автотесты)
- Нет секретов/чувствительных данных в репозитории
- Все переменные окружения — только в .env.example

---

## Контрибуция

- Conventional Commits
- Перед PR: lint, тесты, актуальный CHANGELOG
- Все изменения фиксируются в CHANGELOG.md

---

## Лицензия

MIT
