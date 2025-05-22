# Вклад в проект

Спасибо за интерес к развитию Anonymize Tool!

## Ветвление

- `main` — стабильная ветка
- `develop` — разработка
- `feature/имя` — новые фичи
- `bugfix/имя` — исправления
- `release/версия` — подготовка релиза

## Кодстайл

- Соблюдайте ESLint и Prettier
- Используйте TypeScript
- Следуйте FSD (Feature-Sliced Design)
- Не допускайте дублирования кода
- Абсолютные импорты с `@/`

## Тесты

- Покрытие не менее 80% (unit + e2e)
- Jest для unit, Playwright для e2e и a11y
- Все публичные компоненты должны иметь тесты

## Документация

- Все публичные UI-компоненты документируются в Storybook
- README.md и CHANGELOG.md поддерживаются в актуальном состоянии

## Коммиты

- Используйте Conventional Commits (feat, fix, docs, refactor, test, chore, perf)
- Пример: `feat(ui): добавить компонент Button`

## Pull Request

- Перед PR: lint, тесты, актуальный CHANGELOG
- Описание PR — кратко и по делу
- В PR только относящиеся к задаче изменения

## CHANGELOG

- Все значимые изменения фиксируются в CHANGELOG.md

## Лицензия

MIT
