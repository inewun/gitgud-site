#!/usr/bin/env node

/**
 * Скрипт для исправления импортов
 * 1) Исправляет импорты без слеша: @styles/compositions -> @/styles/compositions
 * 2) Исправляет глубокие относительные импорты на абсолютные с @/
 */

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// Обработка аргументов командной строки
const args = minimist(process.argv.slice(2));
const shouldFix = args.fix || false;

// Корневая директория проекта
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');

// Регулярное выражение для поиска импортов без слеша после @
// Ищет импорты вида: from '@/module/path' или import { x } from '@/module/path'
const IMPORT_REGEX = /from\s+['"]@([^/'"][^'"]*)['"]/g;
// Дополнительный шаблон для динамических импортов и require
const DYNAMIC_IMPORT_REGEX = /(?:import|require)\s*\(\s*['"]@([^/'"][^'"]*)['"]\s*\)/g;

// Регулярное выражение для поиска глубоких относительных импортов (3 уровня и глубже)
const DEEP_RELATIVE_IMPORT_REGEX = /from\s+['"](?:\.\.\/){3,}([^'"]+)['"]/g;
const DEEP_RELATIVE_DYNAMIC_IMPORT_REGEX =
  /(?:import|require)\s*\(\s*['"](?:\.\.\/){3,}([^'"]+)['"]\s*\)/g;

// Исключаемые директории
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build'];

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
    console.error(`Ошибка при определении абсолютного пути: ${error.message}`);
    return null;
  }
}

// Рекурсивная функция обхода директории
function traverseDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let results = {
    scanned: 0,
    needsFix: 0,
    fixed: 0,
    errors: 0,
    withoutPrefix: 0,
    deepRelative: 0,
  };

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Пропускаем исключенные директории
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        const subResults = traverseDirectory(fullPath);
        results.scanned += subResults.scanned;
        results.needsFix += subResults.needsFix;
        results.fixed += subResults.fixed;
        results.errors += subResults.errors;
        results.withoutPrefix += subResults.withoutPrefix;
        results.deepRelative += subResults.deepRelative;
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs|cjs)$/.test(entry.name)) {
      results.scanned++;
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');

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
                const absolutePath = determineAbsolutePath(match.split("'")[1], fullPath);
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
                  const absolutePath = determineAbsolutePath(importPathWithDots, fullPath);
                  if (absolutePath) {
                    return `import('@/${absolutePath}')`;
                  }
                  return match; // Если не удалось преобразовать, оставляем как есть
                },
              );
            }

            // Если есть изменения, записываем файл
            if (newContent !== fileContent) {
              fs.writeFileSync(fullPath, newContent, 'utf8');
              console.log(`✅ Исправлен файл: ${path.relative(ROOT_DIR, fullPath)}`);
              results.fixed++;
            }
          } else {
            console.log(`⚠️ Требует исправления: ${path.relative(ROOT_DIR, fullPath)}`);
          }
        }
      } catch (error) {
        console.error(
          `❌ Ошибка при обработке файла ${path.relative(ROOT_DIR, fullPath)}:`,
          error.message,
        );
        results.errors++;
      }
    }
  }

  return results;
}

// Основная функция
function main() {
  console.log(`🔍 ${shouldFix ? 'Исправление' : 'Проверка'} импортов...`);

  const results = traverseDirectory(ROOT_DIR);

  console.log('\n📊 Результаты:');
  console.log(`- Просканировано файлов: ${results.scanned}`);
  console.log(`- Требуют исправления: ${results.needsFix}`);
  console.log(`  • Импорты без префикса @/: ${results.withoutPrefix}`);
  console.log(`  • Глубокие относительные импорты: ${results.deepRelative}`);

  if (shouldFix) {
    console.log(`- Исправлено файлов: ${results.fixed}`);
  } else if (results.needsFix > 0) {
    console.log('\n💡 Для автоматического исправления запустите скрипт с флагом --fix:');
    console.log('   pnpm fix-imports --fix');
  }

  if (results.errors > 0) {
    console.log(`- Ошибки при обработке: ${results.errors}`);
  }

  if (shouldFix && results.fixed > 0) {
    console.log('\n✨ Импорты успешно исправлены!');
  } else if (results.needsFix === 0) {
    console.log('\n✅ Все импорты корректны, исправления не требуются.');
  }
}

main();
