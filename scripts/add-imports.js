#!/usr/bin/env node

/**
 * Скрипт для добавления импортов композиций в файлы, где они отсутствуют
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');

// Регулярное выражение для поиска импортов React или первого импорта
const importRegex = /^(import\s+.*?;)\s*$/m;
const lastImportRegex = /^import\s+.*?;\s*$/gm;

// Рекурсивная функция обхода директории
function traverseDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let fixedFiles = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Пропускаем node_modules и .git
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        fixedFiles += traverseDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?)$/.test(entry.name)) {
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');

        // Если файл содержит React и использует className, но не импортирует композиции
        if (
          fileContent.includes('className=') &&
          !fileContent.includes('@styles/compositions') &&
          !fileContent.includes('compositions')
        ) {
          // Определяем необходимые композиции на основе классов в файле
          const compositions = [];
          if (
            fileContent.includes('flex') ||
            fileContent.includes('grid') ||
            fileContent.includes('items-center')
          ) {
            compositions.push('layout');
          }
          if (fileContent.includes('text-') || fileContent.includes('font-')) {
            compositions.push('typography');
          }
          if (
            fileContent.includes('border') ||
            fileContent.includes('bg-') ||
            fileContent.includes('rounded')
          ) {
            compositions.push('containers');
          }
          if (fileContent.includes('animate-')) {
            compositions.push('animations');
          }

          if (compositions.length > 0) {
            // Формируем строку импорта
            const importStatement = `import { ${compositions.join(', ')} } from '@/styles/compositions';\n`;

            // Находим позицию для вставки импорта
            let lastImportMatch;
            const matches = [...fileContent.matchAll(lastImportRegex)];
            if (matches.length > 0) {
              lastImportMatch = matches[matches.length - 1];
            }

            let newContent;
            if (lastImportMatch) {
              // Вставляем после последнего импорта
              const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
              newContent =
                fileContent.slice(0, insertIndex) +
                '\n' +
                importStatement +
                fileContent.slice(insertIndex);
            } else {
              // Если нет импортов, вставляем в начало файла
              newContent = importStatement + fileContent;
            }

            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Добавлен импорт композиций в файл: ${fullPath}`);
            fixedFiles++;
          }
        }
      } catch (error) {
        console.error(`Ошибка при обработке файла ${fullPath}:`, error);
      }
    }
  }

  return fixedFiles;
}

// Основная функция
function main() {
  console.log('Добавление импортов композиций...');
  const fixedFiles = traverseDirectory(SRC_DIR);

  if (fixedFiles > 0) {
    console.log(`\nДобавлены импорты в ${fixedFiles} файлов`);
  } else {
    console.log('\nНе найдено файлов, требующих добавления импортов');
  }
}

main();
