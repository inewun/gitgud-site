#!/usr/bin/env node

/**
 * Унифицированный скрипт для автоматического исправления ошибок в проекте
 * Объединяет функциональность нескольких отдельных скриптов в один
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const { glob } = require('glob');

// Обработка аргументов командной строки
const args = minimist(process.argv.slice(2));
const shouldFix = args.fix !== false; // По умолчанию включен режим исправления
const verbose = args.verbose || false; // Подробный режим вывода
const maxPasses = args.passes || 3; // Максимальное количество проходов для ESLint

// Корневая директория проекта
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');

// Исключаемые директории
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build'];

// Функция для выполнения команды и вывода результата
function runCommand(command, description) {
  console.log(`\n🚀 ${description}...`);

  if (verbose) {
    console.log(`Выполнение: ${command}`);
  }

  try {
    const output = execSync(command, { encoding: 'utf8', stdio: verbose ? 'inherit' : 'pipe' });
    console.log(`✅ ${description} - завершено успешно`);
    return { success: true, output };
  } catch (error) {
    console.error(`⚠️ Возникли проблемы при выполнении: ${description}`);
    if (verbose) {
      console.error(error.stdout || error.message);
    }
    return { success: false, output: error.stdout || error.message };
  }
}

// Функция для поиска файлов по шаблону
async function findFiles(pattern) {
  try {
    return await glob(pattern, {
      ignore: EXCLUDED_DIRS.map(dir => `**/${dir}/**`),
    });
  } catch (error) {
    console.error(`Ошибка при поиске файлов по шаблону ${pattern}:`, error);
    return [];
  }
}

// РАЗДЕЛ 1: СИНХРОНИЗАЦИЯ НАСТРОЕК АЛИАСОВ

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
];

// Проверка и исправление tsconfig.json
function syncAliases() {
  console.log('\n🔍 Синхронизация настроек алиасов...');
  let hasChanges = false;

  // Проверка tsconfig.json
  try {
    const tsConfigPath = path.join(ROOT_DIR, 'tsconfig.json');
    const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf8');
    const tsConfig = JSON.parse(tsConfigContent);

    // Если нет секции paths, создаем её
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }

    if (!tsConfig.compilerOptions.paths) {
      tsConfig.compilerOptions.paths = {};
    }

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
        if (verbose) {
          console.log(`⚠️ Проблема с алиасом ${alias.name} в tsconfig.json`);
        }

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
      if (verbose) {
        console.log('⚠️ Отсутствует или неверное значение baseUrl в tsconfig.json');
      }

      if (shouldFix) {
        tsConfig.compilerOptions.baseUrl = '.';
        hasChanges = true;
      }
    }

    // Записываем изменения, если они есть и включен режим исправления
    if (hasChanges && shouldFix) {
      fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2), 'utf8');
      console.log('✅ Настройки алиасов в tsconfig.json успешно обновлены');
    } else if (!hasChanges) {
      console.log('✅ Настройки алиасов в tsconfig.json корректны');
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке файла tsconfig.json: ${error.message}`);
  }

  return hasChanges;
}

// РАЗДЕЛ 2: ИСПРАВЛЕНИЕ ИМПОРТОВ

// Регулярное выражение для поиска импортов без слеша после @
const IMPORT_REGEX = /from\s+['"]@([^/'"][^'"]*)['"]/g;
// Дополнительный шаблон для динамических импортов и require
const DYNAMIC_IMPORT_REGEX = /(?:import|require)\s*\(\s*['"]@([^/'"][^'"]*)['"]\s*\)/g;

// Регулярное выражение для поиска глубоких относительных импортов (3 уровня и глубже)
const DEEP_RELATIVE_IMPORT_REGEX = /from\s+['"](?:\.\.\/){3,}([^'"]+)['"]/g;
const DEEP_RELATIVE_DYNAMIC_IMPORT_REGEX =
  /(?:import|require)\s*\(\s*['"](?:\.\.\/){3,}([^'"]+)['"]\s*\)/g;

// Функция для определения абсолютного пути импорта
function determineAbsolutePath(relativeImportPath, sourceFilePath) {
  try {
    // Получаем директорию исходного файла
    const sourceDir = path.dirname(sourceFilePath);

    // Получаем абсолютный путь импортируемого файла
    let absoluteImportPath = path.resolve(sourceDir, relativeImportPath);

    // Если путь указывает на директорию src, преобразуем в путь с @/
    if (absoluteImportPath.startsWith(SRC_DIR)) {
      const relativePath = path.relative(SRC_DIR, absoluteImportPath);
      return relativePath.replace(/\\/g, '/'); // Нормализуем слеши для Windows
    }

    return null; // Не удалось преобразовать в путь с @/
  } catch (error) {
    if (verbose) {
      console.error(`Ошибка при определении абсолютного пути: ${error.message}`);
    }
    return null;
  }
}

// Функция для исправления импортов
async function fixImports() {
  console.log('\n🔍 Исправление импортов...');

  // Находим все файлы TypeScript и JavaScript
  const files = await findFiles('**/*.{ts,tsx,js,jsx,mjs,cjs}');

  let results = {
    scanned: 0,
    needsFix: 0,
    fixed: 0,
    errors: 0,
    withoutPrefix: 0,
    deepRelative: 0,
  };

  for (const file of files) {
    // Пропускаем файлы в исключенных директориях
    if (EXCLUDED_DIRS.some(dir => file.includes(`/${dir}/`))) {
      continue;
    }

    results.scanned++;
    try {
      const fileContent = fs.readFileSync(file, 'utf8');

      // Проверяем наличие импортов без слеша после @
      const hasImportsWithoutPrefix =
        IMPORT_REGEX.test(fileContent) || DYNAMIC_IMPORT_REGEX.test(fileContent);

      // Сбрасываем lastIndex для повторного использования регулярных выражений
      IMPORT_REGEX.lastIndex = 0;
      DYNAMIC_IMPORT_REGEX.lastIndex = 0;

      // Проверяем наличие глубоких относительных импортов
      const hasDeepRelativeImports =
        DEEP_RELATIVE_IMPORT_REGEX.test(fileContent) ||
        DEEP_RELATIVE_DYNAMIC_IMPORT_REGEX.test(fileContent);

      // Сбрасываем lastIndex
      DEEP_RELATIVE_IMPORT_REGEX.lastIndex = 0;
      DEEP_RELATIVE_DYNAMIC_IMPORT_REGEX.lastIndex = 0;

      // Если есть импорты, требующие исправления
      if (hasImportsWithoutPrefix || hasDeepRelativeImports) {
        results.needsFix++;

        if (hasImportsWithoutPrefix) {
          results.withoutPrefix++;
        }

        if (hasDeepRelativeImports) {
          results.deepRelative++;
        }

        if (shouldFix) {
          let newContent = fileContent;

          // Исправляем импорты без префикса @/
          if (hasImportsWithoutPrefix) {
            newContent = newContent
              .replace(IMPORT_REGEX, "from '@/$1'")
              .replace(DYNAMIC_IMPORT_REGEX, "import('@/$1')");
          }

          // Исправляем глубокие относительные импорты
          if (hasDeepRelativeImports) {
            // Для стандартных импортов
            newContent = newContent.replace(DEEP_RELATIVE_IMPORT_REGEX, (match, importPath) => {
              const absolutePath = determineAbsolutePath(match.split("'")[1], file);
              if (absolutePath) {
                return `from '@/${absolutePath}'`;
              }
              return match; // Если не удалось преобразовать, оставляем как есть
            });

            // Для динамических импортов
            newContent = newContent.replace(
              DEEP_RELATIVE_DYNAMIC_IMPORT_REGEX,
              (match, importPath) => {
                const importPathWithDots = match.split("'")[1];
                const absolutePath = determineAbsolutePath(importPathWithDots, file);
                if (absolutePath) {
                  return `import('@/${absolutePath}')`;
                }
                return match; // Если не удалось преобразовать, оставляем как есть
              },
            );
          }

          // Если есть изменения, записываем файл
          if (newContent !== fileContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            if (verbose) {
              console.log(`✅ Исправлен файл: ${path.relative(ROOT_DIR, file)}`);
            }
            results.fixed++;
          }
        } else if (verbose) {
          console.log(`⚠️ Требует исправления: ${path.relative(ROOT_DIR, file)}`);
        }
      }
    } catch (error) {
      if (verbose) {
        console.error(
          `❌ Ошибка при обработке файла ${path.relative(ROOT_DIR, file)}:`,
          error.message,
        );
      }
      results.errors++;
    }
  }

  console.log('\n📊 Результаты исправления импортов:');
  console.log(`- Просканировано файлов: ${results.scanned}`);
  console.log(`- Требовали исправления: ${results.needsFix}`);
  console.log(`  • Импорты без префикса @/: ${results.withoutPrefix}`);
  console.log(`  • Глубокие относительные импорты: ${results.deepRelative}`);

  if (shouldFix) {
    console.log(`- Исправлено файлов: ${results.fixed}`);
  }

  if (results.errors > 0) {
    console.log(`- Ошибки при обработке: ${results.errors}`);
  }

  return results;
}

// РАЗДЕЛ 3: ИСПРАВЛЕНИЕ ОШИБОК TYPESCRIPT

// Функция для исправления ошибок с any типами
async function fixTypeScriptErrors() {
  console.log('\n🛠️ Исправление типичных ошибок TypeScript...');
  let fixedCount = 0;

  // Шаг 1: Исправляем any типы
  if (shouldFix) {
    console.log('• Исправление типов any...');

    // Находим файлы TypeScript
    const files = await findFiles('**/*.{ts,tsx}');

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');

        // Заменяем any на более специфичные типы где возможно
        let newContent = content;

        // Замена any[] на подходящие типы массивов
        newContent = newContent.replace(/any\[\]/g, match => {
          // Определяем тип на основе контекста (упрощенно)
          const surroundingText = content.substring(
            Math.max(0, content.indexOf(match) - 100),
            Math.min(content.length, content.indexOf(match) + 100),
          );

          if (surroundingText.includes('string')) return 'string[]';
          if (surroundingText.includes('number')) return 'number[]';
          if (surroundingText.includes('boolean')) return 'boolean[]';
          if (surroundingText.includes('object')) return 'Record<string, unknown>[]';

          return 'unknown[]'; // Безопаснее чем any[]
        });

        // Замена простых any на unknown (более безопасная альтернатива)
        newContent = newContent.replace(/: any(?![[\]{}a-zA-Z0-9])/g, ': unknown');

        // Применяем изменения, если были модификации
        if (newContent !== content) {
          fs.writeFileSync(file, newContent, 'utf8');
          fixedCount++;
          if (verbose) {
            console.log(`✅ Исправлен файл: ${file}`);
          }
        }
      } catch (error) {
        if (verbose) {
          console.error(`❌ Ошибка при обработке файла ${file}:`, error.message);
        }
      }
    }

    console.log(`✅ Исправлено ${fixedCount} файлов с any типами`);
  }

  // Шаг 2: Исправляем импорты внешних библиотек
  if (shouldFix) {
    console.log('• Исправление импортов внешних библиотек...');

    // Определяем маппинг неправильных/правильных путей импорта для внешних библиотек
    const importPatterns = [
      { from: /@\/storybook\/react/g, to: '@storybook/react' },
      { from: /@\/testing-library\/react/g, to: '@testing-library/react' },
      { from: /@\/heroicons\/react\/24\/(outline|solid)/g, to: '@heroicons/react/24/$1' },
      { from: /@\/tailwindcss\/forms/g, to: '@tailwindcss/forms' },
      { from: /@\/trpc\/server/g, to: '@trpc/server' },
      { from: /@\/jest\/globals/g, to: '@jest/globals' },
      { from: /@\/sentry\/nextjs/g, to: '@sentry/nextjs' },
      { from: /@\/hookform\/resolvers\/zod/g, to: '@hookform/resolvers/zod' },
      { from: /@\/reduxjs\/toolkit/g, to: '@reduxjs/toolkit' },
    ];

    // Проходим по всем TS файлам и исправляем импорты
    const files = await findFiles('**/*.{ts,tsx}');
    let importFixCount = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        let newContent = content;
        let wasModified = false;

        // Применяем все паттерны замены
        for (const pattern of importPatterns) {
          const originalContent = newContent;
          newContent = newContent.replace(pattern.from, pattern.to);

          // Проверяем, была ли замена
          if (originalContent !== newContent) {
            wasModified = true;
          }
        }

        // Применяем изменения, если были модификации
        if (wasModified) {
          fs.writeFileSync(file, newContent, 'utf8');
          importFixCount++;
          if (verbose) {
            console.log(`✅ Исправлены импорты в файле: ${file}`);
          }
        }
      } catch (error) {
        if (verbose) {
          console.error(`❌ Ошибка при обработке файла ${file}:`, error.message);
        }
      }
    }

    console.log(`✅ Исправлено ${importFixCount} файлов с ошибками импортов внешних библиотек`);
  }

  // Шаг 3: Добавляем явные типы возвращаемых значений и исправляем неиспользуемые переменные с помощью ESLint
  if (shouldFix) {
    console.log('• Исправление типов возвращаемых значений и неиспользуемых переменных...');

    // Используем ESLint для автоматического исправления
    runCommand(
      'npx eslint . --ext .ts,.tsx --fix --max-warnings=9999 --rule "@typescript-eslint/explicit-function-return-type:warn" --rule "@typescript-eslint/no-unused-vars:error"',
      'ESLint для исправления типов TypeScript',
    );
  }

  return true;
}

// РАЗДЕЛ 4: РАСШИРЕННОЕ ИСПРАВЛЕНИЕ ESLINT

// Создаем временный файл конфигурации с усиленным режимом автоисправления
function createTemporaryEslintConfig() {
  try {
    // Правила, для которых будет принудительно включен режим --fix
    const FIXABLE_RULES = [
      'import/order',
      'import/first',
      'import/newline-after-import',
      'unused-imports/no-unused-imports',
      'prettier/prettier',
      '@typescript-eslint/no-unused-vars',
      '@next/next/no-img-element',
    ];

    const eslintConfigPath = path.resolve(ROOT_DIR, '.eslintrc.js');
    const originalConfig = require(eslintConfigPath);

    // Создаем копию конфигурации с измененными правилами
    const enhancedConfig = JSON.parse(JSON.stringify(originalConfig));

    // Устанавливаем уровень 'warn' для всех правил, которые могут быть исправлены автоматически
    FIXABLE_RULES.forEach(rule => {
      if (enhancedConfig.rules && enhancedConfig.rules[rule]) {
        if (Array.isArray(enhancedConfig.rules[rule])) {
          enhancedConfig.rules[rule][0] = 'warn';
        } else {
          enhancedConfig.rules[rule] = 'warn';
        }
      }
    });

    const tempConfigPath = path.resolve(ROOT_DIR, '.eslintrc.temp.js');
    fs.writeFileSync(tempConfigPath, `module.exports = ${JSON.stringify(enhancedConfig, null, 2)}`);

    return tempConfigPath;
  } catch (error) {
    console.error('Ошибка при создании временной конфигурации ESLint:', error);
    return null;
  }
}

// Функция для запуска расширенного ESLint
function runAdvancedEslintFix() {
  console.log('\n🔧 Запуск расширенного исправления ошибок ESLint...');

  if (!shouldFix) {
    console.log('⚠️ Режим только проверки, ESLint не будет вносить изменения.');
    return;
  }

  // Создаем временную конфигурацию ESLint
  const tempConfigPath = createTemporaryEslintConfig();
  if (!tempConfigPath) {
    console.error(
      '❌ Не удалось создать временную конфигурацию ESLint. Продолжаем с обычным режимом.',
    );
    runCommand(
      'npx eslint . --ext .ts,.tsx --fix --max-warnings=9999',
      'Стандартное исправление ошибок ESLint',
    );
    return;
  }

  console.log('✅ Создана временная конфигурация ESLint для улучшенного режима исправления');

  let pass = 1;
  let previousErrorCount = Infinity;
  let currentErrorCount = Infinity;

  // Запускаем несколько проходов для максимального исправления ошибок
  while (pass <= maxPasses && currentErrorCount > 0 && currentErrorCount < previousErrorCount) {
    console.log(`• Запуск прохода ${pass}/${maxPasses}...`);

    const eslintResult = runCommand(
      `npx eslint . --ext .ts,.tsx --fix --max-warnings=9999 --config ${tempConfigPath}`,
      `ESLint проход ${pass}/${maxPasses}`,
    );

    previousErrorCount = currentErrorCount;

    // Подсчитываем количество оставшихся ошибок
    const output = eslintResult.output || '';
    const errorMatches = output.match(/(\d+) errors?/);
    currentErrorCount = errorMatches ? parseInt(errorMatches[1], 10) : 0;

    console.log(`📊 Проход ${pass}: обнаружено ${currentErrorCount} ошибок`);

    // Если ошибок не осталось, останавливаемся
    if (currentErrorCount === 0) {
      console.log('✨ Все ошибки исправлены!');
      break;
    }

    // Если количество ошибок не уменьшается, останавливаемся
    if (currentErrorCount >= previousErrorCount && pass > 1) {
      console.log('⚠️ Количество ошибок не уменьшается, останавливаем исправления');
      break;
    }

    pass++;
  }

  // Запускаем финальный проход с оригинальной конфигурацией
  console.log('• Запуск финального прохода с оригинальной конфигурацией...');
  runCommand(
    'npx eslint . --ext .ts,.tsx --fix --max-warnings=9999',
    'Финальное исправление ошибок ESLint',
  );

  // Удаляем временную конфигурацию
  try {
    fs.unlinkSync(tempConfigPath);
    console.log('🗑️ Временная конфигурация ESLint удалена');
  } catch (error) {
    if (verbose) {
      console.error('Ошибка при удалении временной конфигурации:', error);
    }
  }
}

// РАЗДЕЛ 5: ФОРМАТИРОВАНИЕ КОДА С PRETTIER

// Функция для форматирования кода с Prettier
function formatCodeWithPrettier() {
  console.log('\n💅 Форматирование кода с Prettier...');

  if (!shouldFix) {
    console.log('⚠️ Режим только проверки, Prettier не будет вносить изменения.');
    return;
  }

  return runCommand(
    'npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss,md}"',
    'Форматирование кода с Prettier',
  );
}

// РАЗДЕЛ 6: ОСНОВНАЯ ФУНКЦИЯ СКРИПТА

// Основная функция скрипта
async function main() {
  console.log('🚀 Запуск унифицированного скрипта для исправления ошибок...');
  console.log(`Режим: ${shouldFix ? 'Исправление' : 'Только проверка'}`);
  console.log(`Подробный вывод: ${verbose ? 'Включен' : 'Выключен'}`);

  // Шаг 1: Синхронизация настроек алиасов
  await syncAliases();

  // Шаг 2: Форматирование кода с Prettier
  formatCodeWithPrettier();

  // Шаг 3: Исправление импортов
  await fixImports();

  // Шаг 4: Исправление типичных ошибок TypeScript
  await fixTypeScriptErrors();

  // Шаг 5: Продвинутое исправление ошибок с помощью ESLint
  runAdvancedEslintFix();

  // Шаг 6: Запуск проверки типов TypeScript
  runCommand('npx tsc --noEmit', 'Проверка типов TypeScript');

  console.log('\n✨ Унифицированное исправление ошибок завершено!');
  console.log('📋 Некоторые проблемы могут требовать ручного исправления.');
  console.log('   Пожалуйста, проверьте оставшиеся ошибки с помощью:');
  console.log('   - pnpm lint');
  console.log('   - pnpm type-check');
}

main().catch(error => {
  console.error('❌ Произошла непредвиденная ошибка:', error);
  process.exit(1);
});
