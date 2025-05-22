// @ts-check

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './src/lib/tsconfig.js.json'],
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'react-hooks',
    'unused-imports',
    'boundaries',
    'jsx-a11y',
    'jest',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Ограничение сложности функций
    complexity: ['error', { max: 15 }],

    // Импорты и алиасы
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          // Все импорты должны начинаться с @/
          {
            pattern: '{react,react-dom,next,next/**}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/lib/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/shared/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/styles/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/domain/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/entities/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/features/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/widgets/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/app/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    // Правила для импортов
    'import/no-duplicates': 'error',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-relative-packages': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-self-import': 'error',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    'import/no-extraneous-dependencies': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-unused-modules': 'warn',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Запрет импортов без алиаса @/
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@styles/*',
              '@app/*',
              '@features/*',
              '@entities/*',
              '@widgets/*',
              '@lib/*',
              '@shared/*',
              '@domain/*',
            ],
            message: "Импорты должны начинаться с '@/' (пример: '@/styles/*' вместо '@styles/*')",
          },
          {
            group: ['../../../*'],
            message: "Не используйте глубокие относительные импорты, используйте алиасы с '@/'",
          },
        ],
      },
    ],

    // Правило для проверки абсолютных импортов
    'import/no-absolute-path': 'error',
    'import/no-unresolved': 'error',

    // A11y правила
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],

    // FSD архитектурные правила
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // Определение правил для импортов между слоями
          { from: 'shared', allow: ['shared'] },
          { from: 'entities', allow: ['shared', 'entities'] },
          { from: 'features', allow: ['shared', 'entities', 'features'] },
          { from: 'widgets', allow: ['shared', 'entities', 'features', 'widgets'] },
          { from: 'app', allow: ['shared', 'entities', 'features', 'widgets', 'pages', 'app'] },
        ],
      },
    ],

    // Дополнительные правила для импортов
    'boundaries/entry-point': [
      'error',
      {
        default: 'disallow',
        rules: [
          // Правила для импорта компонентов (только через public API)
          {
            target: 'shared',
            allow: ['index.ts', 'public-api.ts', 'utils.ts', '**/*.ts', '**/*.tsx'],
          },
          {
            target: 'entities',
            allow: ['index.ts', 'public-api.ts'],
          },
          {
            target: 'features',
            allow: [
              'index.ts',
              'public-api.ts',
              'ui/**/*.tsx',
              'api/**/*.ts',
              'model/**/*.ts',
              'types/**/*.ts',
            ],
          },
          {
            target: 'widgets',
            allow: ['index.ts', 'public-api.ts', 'ui/**/*.tsx'],
          },
          // Специальные директории, из которых можно импортировать напрямую
          { target: ['shared/lib/**', 'shared/api/**'], allow: '**/*' },
        ],
      },
    ],

    // Дополнительные правила путей импорта
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Запрет импорта из src в node_modules
          { target: 'node_modules', from: './src' },
          // Запрет импорта из папки __tests__ в компоненты
          { target: './src', from: './src/**/__tests__' },
          // Запрет импорта из папки app в общие компоненты
          { target: './src/shared', from: './src/app' },
          { target: './src/entities', from: './src/app' },
          { target: './src/features', from: './src/app' },
          { target: './src/widgets', from: './src/app' },
        ],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'boundaries/elements': [
      { type: 'app', pattern: 'app/*' },
      { type: 'pages', pattern: 'pages/*' },
      { type: 'widgets', pattern: 'widgets/*' },
      { type: 'features', pattern: 'features/*' },
      { type: 'entities', pattern: 'entities/*' },
      { type: 'shared', pattern: 'shared/*' },
    ],
    'boundaries/ignore': ['**/*.test.*'],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  overrides: [
    {
      // Применяем правила только для тестовых файлов
      files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        // Отключаем базовое правило для тестовых файлов
        '@typescript-eslint/unbound-method': 'off',
        // Включаем специальную версию правила для Jest
        'jest/unbound-method': 'error',
        // Отключаем некоторые правила, которые могут мешать в тестах
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
