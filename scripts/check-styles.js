#!/usr/bin/env node

/**
 * Скрипт для проверки правильного использования композиций стилей
 *
 * Проверяет:
 * 1. Использование cn для комбинирования классов
 * 2. Использование композиций из compositions.ts вместо прямого задания классов
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');
const COMPOSITIONS_PATH = path.resolve(SRC_DIR, 'styles/compositions.ts');

// Получаем содержимое файла compositions.ts
const compositionsContent = fs.readFileSync(COMPOSITIONS_PATH, 'utf8');

// Извлекаем определенные композиции стилей
function extractCompositions(content) {
  const result = {};
  const regex = /export const (\w+) = {([^}]+)}/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [_, name, properties] = match;

    const propertiesObj = {};
    const propertyLines = properties.split('\n');

    propertyLines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(part => part.trim());
        if (key && value) {
          // Удаляем запятые и кавычки
          const cleanKey = key.replace(/[',]/g, '');
          const cleanValue = value.replace(/[',]/g, '');
          propertiesObj[cleanKey] = cleanValue;
        }
      }
    });

    result[name] = propertiesObj;
  }

  return result;
}

const compositions = extractCompositions(compositionsContent);

// Регулярные выражения для поиска ошибок
const patterns = [
  // Проверка на неправильное объединение классов (конкатенация строк вместо cn)
  {
    pattern:
      /className=\{[^}]*(['"`][^'"`]*['"`]\s*\+\s*['"`][^'"`]*['"`]|[^{}'"]+\s*\+\s*['"`][^'"`]*['"`]|['"`][^'"`]*['"`]\s*\+\s*[^{}'"]+)/g,
    message: '  ❌ Используйте cn вместо конкатенации строк',
  },
];

// Проверка на использование прямых tailwind классов вместо композиций
function checkUncomposedStyles(content, filePath) {
  const compositionNames = Object.keys(compositions);

  // Проверяем наличие импорта композиций
  const hasCompositionImport = /import.*from ['"]@styles\/compositions['"]/.test(content);

  // Шаблоны классов, которые должны использоваться из композиций
  const commonPatterns = [
    {
      pattern: /className=['"].*flex (?:items-center|justify-center|flex-col).*['"]/g,
      composition: 'layout',
    },
    { pattern: /className=['"].*(?:text-\w+|font-\w+).*['"]/g, composition: 'typography' },
    {
      pattern: /className=['"].*(?:bg-\w+|border|rounded-\w+|shadow-\w+).*['"]/g,
      composition: 'containers',
    },
    { pattern: /className=['"].*animate-.*['"]/g, composition: 'animations' },
  ];

  let hasUncomposedStyles = false;

  // Если в файле есть React компоненты, но нет импорта композиций
  if (
    content.includes('function') &&
    content.includes('return') &&
    content.includes('className=') &&
    !hasCompositionImport
  ) {
    console.log(`[${filePath}] Отсутствует импорт композиций из @styles/compositions`);
    hasUncomposedStyles = true;
  }

  // Проверяем использование прямых классов, которые должны быть в композициях
  commonPatterns.forEach(({ pattern, composition }) => {
    const matches = content.match(pattern);
    if (matches && !hasCompositionImport) {
      console.log(
        `[${filePath}] Найдены стили, которые должны использоваться из композиции ${composition}:`,
      );
      matches.slice(0, 3).forEach(match => {
        // Показываем только первые 3 примера
        console.log(`  ${match}`);
      });
      hasUncomposedStyles = true;
    }
  });

  return hasUncomposedStyles;
}

// Основная функция проверки файла
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let hasIssues = false;

  // Проверка некорректного объединения классов
  const hasBadConcatenation = patterns.some(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      console.log(`[${filePath}] Найдена ошибка в className:`, pattern.message);
      matches.forEach(match => {
        console.log(`  ${match}`);
      });
      return true;
    }
    return false;
  });

  // Проверка использования композиций стилей
  const hasUncomposedStyles = checkUncomposedStyles(content, filePath);

  return hasBadConcatenation || hasUncomposedStyles;
}

// Рекурсивная функция обхода директории
function traverseDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let filesWithIssues = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Пропускаем node_modules и .git
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        filesWithIssues += traverseDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?)$/.test(entry.name)) {
      try {
        if (checkFile(fullPath)) {
          filesWithIssues++;
        }
      } catch (error) {
        console.error(`Ошибка при обработке файла ${fullPath}:`, error);
      }
    }
  }

  return filesWithIssues;
}

// Основная функция
function main() {
  console.log('Проверка стилей на использование композиций...');
  const filesWithIssues = traverseDirectory(SRC_DIR);

  if (filesWithIssues > 0) {
    console.log(`\nНайдено ${filesWithIssues} файлов с проблемами использования стилей`);
    console.log('Рекомендации:');
    console.log('1. Используйте импорт из @styles/compositions');
    console.log('2. Используйте cn вместо конкатенации строк');
    process.exit(1);
  } else {
    console.log('\nПроблем с использованием стилей не найдено');
  }
}

main();
