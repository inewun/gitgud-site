#!/usr/bin/env node

/**
 * Скрипт для синхронизации настроек алиасов в проекте
 * Обеспечивает согласованность алиасов между различными конфигурационными файлами
 */

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// Обработка аргументов командной строки
const args = minimist(process.argv.slice(2));
const shouldFix = args.fix || false;

// Корневая директория проекта
const ROOT_DIR = path.resolve(__dirname, '..');

// Список алиасов для проверки и исправления
const EXPECTED_ALIASES = [
  { name: '@/*', path: './src/*' },
  { name: '@/app/*', path: './src/app/*' },
  { name: '@/widgets/*', path: './src/widgets/*' },
  { name: '@/features/*', path: './src/features/*' },
  { name: '@/entities/*', path: './src/entities/*' },
  { name: '@/shared/*', path: './src/shared/*' },
  { name: '@/domain/*', path: './src/domain/*' },
  { name: '@/styles/*', path: './src/styles/*' },
  { name: '@/lib/*', path: './src/lib/*' },
  { name: '@/pages/*', path: './src/pages/*' },
  { name: '@/public/*', path: './public/*' },
  { name: '@/test/*', path: './__tests__/*' },
  { name: '@/e2e/*', path: './e2e/*' },
  { name: '@/storybook/*', path: './node_modules/@storybook/*' },
  { name: '@/testing-library/*', path: './node_modules/@testing-library/*' },
  { name: '@/playwright/*', path: './node_modules/@playwright/*' },
  { name: '@/axe-core/*', path: './node_modules/@axe-core/*' },
  { name: '@/heroicons/*', path: './node_modules/@heroicons/*' },
  { name: '@/tailwindcss/*', path: './node_modules/@tailwindcss/*' },
  { name: '@/formatjs/*', path: './node_modules/@formatjs/*' },
  { name: '@/trpc/*', path: './node_modules/@trpc/*' },
  { name: '@/jest/*', path: './node_modules/@jest/*' },
  { name: '@/sentry/*', path: './node_modules/@sentry/*' },
  { name: '@/hookform/*', path: './node_modules/@hookform/*' },
  { name: '@/reduxjs/*', path: './node_modules/@reduxjs/*' },
];

// Проверка и исправление tsconfig.json
function checkTsConfig() {
  console.log('\n🔍 Проверка настроек алиасов в tsconfig.json...');

  const tsConfigPath = path.join(ROOT_DIR, 'tsconfig.json');

  try {
    // Читаем файл конфигурации
    const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf8');
    const tsConfig = JSON.parse(tsConfigContent);

    // Если нет секции paths, создаем её
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }

    if (!tsConfig.compilerOptions.paths) {
      tsConfig.compilerOptions.paths = {};
    }

    let hasChanges = false;
    const paths = tsConfig.compilerOptions.paths;

    // Проверяем каждый ожидаемый алиас
    for (const alias of EXPECTED_ALIASES) {
      // Проверяем наличие и корректность алиаса
      const hasCorrectAlias =
        paths[alias.name] &&
        Array.isArray(paths[alias.name]) &&
        paths[alias.name].includes(alias.path);

      // Проверяем наличие ошибочного алиаса (без слеша после @)
      const wrongAlias = alias.name.replace('@/', '@');
      const hasWrongAlias = paths[wrongAlias] !== undefined;

      if (!hasCorrectAlias || hasWrongAlias) {
        console.log(`⚠️ Проблема с алиасом ${alias.name} в tsconfig.json`);

        if (shouldFix) {
          // Устанавливаем правильный алиас
          paths[alias.name] = [alias.path];

          // Удаляем неправильный алиас, если он существует
          if (hasWrongAlias) {
            delete paths[wrongAlias];
          }

          hasChanges = true;
        }
      }
    }

    // Проверяем наличие baseUrl
    if (!tsConfig.compilerOptions.baseUrl || tsConfig.compilerOptions.baseUrl !== '.') {
      console.log('⚠️ Отсутствует или неверное значение baseUrl в tsconfig.json');

      if (shouldFix) {
        tsConfig.compilerOptions.baseUrl = '.';
        hasChanges = true;
      }
    }

    // Записываем изменения, если они есть и включен режим исправления
    if (hasChanges && shouldFix) {
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2), 'utf8');
      console.log('✅ Исправлены настройки алиасов в tsconfig.json');
    } else if (!hasChanges) {
      console.log('✅ Настройки алиасов в tsconfig.json корректны');
    }

    return hasChanges;
  } catch (error) {
    console.error(`❌ Ошибка при обработке файла tsconfig.json: ${error.message}`);
    return false;
  }
}

// Проверка и исправление .eslintrc.js
function checkEslintConfig() {
  console.log('\n🔍 Проверка настроек импортов в .eslintrc.js...');

  const eslintConfigPath = path.join(ROOT_DIR, '.eslintrc.js');

  try {
    // Читаем файл конфигурации
    let eslintConfigContent = fs.readFileSync(eslintConfigPath, 'utf8');

    // Проверяем правило no-restricted-imports
    const restrictedImportsPattern = /'no-restricted-imports':\s*\[\s*['"]warn['"]/;
    const hasRestrictedImportsRule = restrictedImportsPattern.test(eslintConfigContent);

    // Проверяем наличие шаблонов импортов для предупреждений
    const aliasWarningPatterns = [
      '@styles/*',
      '@app/*',
      '@features/*',
      '@entities/*',
      '@widgets/*',
      '@lib/*',
      '@shared/*',
      '@domain/*',
    ];

    let hasAllAliasWarnings = true;
    for (const pattern of aliasWarningPatterns) {
      if (!eslintConfigContent.includes(`'${pattern}'`)) {
        hasAllAliasWarnings = false;
        break;
      }
    }

    // Проверяем правильность сообщения об ошибке
    const correctMessage =
      "Импорты должны начинаться с '@/' (пример: '@/styles/*' вместо '@styles/*')";
    const hasCorrectMessage = eslintConfigContent.includes(correctMessage);

    // Проверка правила для глубоких относительных импортов
    const hasDeepRelativeRule = eslintConfigContent.includes("'../../../*'");

    let hasChanges = false;

    // Если есть проблемы с правилами импортов, исправляем
    if (
      !hasRestrictedImportsRule ||
      !hasAllAliasWarnings ||
      !hasCorrectMessage ||
      !hasDeepRelativeRule
    ) {
      console.log('⚠️ Найдены проблемы с правилами импортов в .eslintrc.js');

      if (shouldFix) {
        // Если нужно полностью заменить правило no-restricted-imports
        if (
          !hasRestrictedImportsRule ||
          !hasAllAliasWarnings ||
          !hasCorrectMessage ||
          !hasDeepRelativeRule
        ) {
          const noRestrictedImportsRule = `
    // Запрет импортов без алиаса @/
    'no-restricted-imports': [
      'warn',
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
    ],`;

          // Пытаемся найти и заменить существующее правило
          const ruleRegex = /'no-restricted-imports':\s*\[[\s\S]*?\],/;
          if (ruleRegex.test(eslintConfigContent)) {
            eslintConfigContent = eslintConfigContent.replace(ruleRegex, noRestrictedImportsRule);
          } else {
            // Если правило не найдено, добавляем его перед import/no-absolute-path
            eslintConfigContent = eslintConfigContent.replace(
              /'import\/no-absolute-path':/,
              `${noRestrictedImportsRule}\n\n    // Правило для проверки абсолютных импортов\n    'import/no-absolute-path':`,
            );
          }

          hasChanges = true;
        }

        // Записываем изменения
        if (hasChanges) {
          fs.writeFileSync(eslintConfigPath, eslintConfigContent, 'utf8');
          console.log('✅ Исправлены правила импортов в .eslintrc.js');
        }
      }
    } else {
      console.log('✅ Правила импортов в .eslintrc.js корректны');
    }

    return hasChanges;
  } catch (error) {
    console.error(`❌ Ошибка при обработке файла .eslintrc.js: ${error.message}`);
    return false;
  }
}

// Проверка и исправление jsconfig.json (если он существует)
function checkJsConfig() {
  const jsConfigPath = path.join(ROOT_DIR, 'jsconfig.json');

  // Проверяем, существует ли файл
  if (!fs.existsSync(jsConfigPath)) {
    return false;
  }

  console.log('\n🔍 Проверка настроек алиасов в jsconfig.json...');

  try {
    // Читаем файл конфигурации
    const jsConfigContent = fs.readFileSync(jsConfigPath, 'utf8');
    let jsConfig;

    try {
      jsConfig = JSON.parse(jsConfigContent);
    } catch (parseError) {
      console.error(`❌ Ошибка при парсинге jsconfig.json: ${parseError.message}`);
      return false;
    }

    // Если нет секции paths, создаем её
    if (!jsConfig.compilerOptions) {
      jsConfig.compilerOptions = {};
    }

    if (!jsConfig.compilerOptions.paths) {
      jsConfig.compilerOptions.paths = {};
    }

    let hasChanges = false;
    const paths = jsConfig.compilerOptions.paths;

    // Проверяем каждый ожидаемый алиас
    for (const alias of EXPECTED_ALIASES) {
      // Проверяем наличие и корректность алиаса
      const hasCorrectAlias =
        paths[alias.name] &&
        Array.isArray(paths[alias.name]) &&
        paths[alias.name].includes(alias.path);

      // Проверяем наличие ошибочного алиаса (без слеша после @)
      const wrongAlias = alias.name.replace('@/', '@');
      const hasWrongAlias = paths[wrongAlias] !== undefined;

      if (!hasCorrectAlias || hasWrongAlias) {
        console.log(`⚠️ Проблема с алиасом ${alias.name} в jsconfig.json`);

        if (shouldFix) {
          // Устанавливаем правильный алиас
          paths[alias.name] = [alias.path];

          // Удаляем неправильный алиас, если он существует
          if (hasWrongAlias) {
            delete paths[wrongAlias];
          }

          hasChanges = true;
        }
      }
    }

    // Проверяем наличие baseUrl
    if (!jsConfig.compilerOptions.baseUrl || jsConfig.compilerOptions.baseUrl !== '.') {
      console.log('⚠️ Отсутствует или неверное значение baseUrl в jsconfig.json');

      if (shouldFix) {
        jsConfig.compilerOptions.baseUrl = '.';
        hasChanges = true;
      }
    }

    // Записываем изменения, если они есть и включен режим исправления
    if (hasChanges && shouldFix) {
      fs.writeFileSync(jsConfigPath, JSON.stringify(jsConfig, null, 2), 'utf8');
      console.log('✅ Исправлены настройки алиасов в jsconfig.json');
    } else if (!hasChanges) {
      console.log('✅ Настройки алиасов в jsconfig.json корректны');
    }

    return hasChanges;
  } catch (error) {
    console.error(`❌ Ошибка при обработке файла jsconfig.json: ${error.message}`);
    return false;
  }
}

// Основная функция
function main() {
  console.log(`🔍 ${shouldFix ? 'Исправление' : 'Проверка'} настроек алиасов в проекте...`);

  const tsConfigChanged = checkTsConfig();
  const eslintConfigChanged = checkEslintConfig();
  const jsConfigChanged = checkJsConfig();

  console.log('\n📊 Результаты:');

  if (shouldFix) {
    if (tsConfigChanged || eslintConfigChanged || jsConfigChanged) {
      console.log('✅ Настройки алиасов успешно обновлены');
      console.log('\n💡 Рекомендуется запустить:');
      console.log('   pnpm fix:imports --fix   - для исправления импортов');
      console.log('   pnpm lint              - для проверки проекта');
    } else {
      console.log('ℹ️ Все настройки алиасов уже актуальны, изменения не требуются');
    }
  } else if (!tsConfigChanged && !eslintConfigChanged && !jsConfigChanged) {
    console.log('✅ Все настройки алиасов корректны');
  } else {
    console.log('⚠️ Найдены проблемы с настройками алиасов');
    console.log('\n💡 Для автоматического исправления запустите:');
    console.log('   pnpm sync-aliases --fix');
  }
}

main();
