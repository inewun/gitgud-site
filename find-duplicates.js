const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Директории, которые следует исключить
const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'coverage',
  '.swc',
  'test-results',
  'playwright-report',
  'dist',
  'build',
];

// Кэш для хранения хешей файлов
const fileHashes = new Map();
// Объект для хранения дубликатов (хеш => массив путей к файлам)
const duplicates = new Map();

// Функция для вычисления хеша содержимого файла
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    console.error(`Ошибка при чтении файла ${filePath}:`, error.message);
    return null;
  }
}

// Рекурсивная функция обхода директории
function traverseDirectory(dirPath, basePath = '') {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryName = entry.name;
      const fullPath = path.join(dirPath, entryName);

      if (entry.isDirectory()) {
        // Пропускаем исключенные директории
        if (!EXCLUDED_DIRS.includes(entryName)) {
          traverseDirectory(fullPath, basePath || dirPath);
        }
      } else if (entry.isFile()) {
        // Вычисляем относительный путь к файлу от базового пути
        const relativePath = path.relative(basePath || dirPath, fullPath);
        const fileHash = getFileHash(fullPath);

        if (fileHash) {
          // Если хеш уже существует, добавляем файл в список дубликатов
          if (fileHashes.has(fileHash)) {
            const originalPath = fileHashes.get(fileHash);

            if (!duplicates.has(fileHash)) {
              duplicates.set(fileHash, [originalPath]);
            }

            duplicates.get(fileHash).push(fullPath);
          } else {
            // Иначе сохраняем хеш и путь к файлу
            fileHashes.set(fileHash, fullPath);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Ошибка при обходе директории ${dirPath}:`, error.message);
  }
}

// Функция для записи результатов в файл
function writeDuplicatesToFile(outputFile) {
  let content = '# Дубликаты файлов в проекте\n\n';
  content += '| № | Хеш MD5 | Размер | Количество дубликатов | Пути к файлам |\n';
  content += '|---|---------|--------|----------------------|---------------|\n';

  let counter = 1;

  for (const [hash, paths] of duplicates.entries()) {
    if (paths.length > 1) {
      const fileSize = fs.statSync(paths[0]).size;
      const formattedSize = formatFileSize(fileSize);
      const pathsStr = paths.map(p => `- ${p}`).join('<br>');

      content += `| ${counter} | ${hash} | ${formattedSize} | ${paths.length} | ${pathsStr} |\n`;
      counter++;
    }
  }

  if (counter === 1) {
    content += '| - | - | - | - | Дубликаты не найдены |\n';
  }

  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`Результаты записаны в файл: ${outputFile}`);
  console.log(`Всего найдено групп дубликатов: ${counter - 1}`);
}

// Форматирование размера файла
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// Основная функция
function main() {
  console.log('Начинаем поиск дубликатов файлов...');
  const startTime = Date.now();

  // Запускаем обход из корневой директории проекта
  traverseDirectory(process.cwd());

  console.log(`Проанализировано файлов: ${fileHashes.size}`);

  // Фильтруем только фактические дубликаты (более 1 файла с одинаковым хешем)
  let duplicateCount = 0;
  for (const [hash, paths] of duplicates.entries()) {
    if (paths.length <= 1) {
      duplicates.delete(hash);
    } else {
      duplicateCount += paths.length;
    }
  }

  console.log(`Найдено групп дубликатов: ${duplicates.size}`);
  console.log(`Общее количество дублирующихся файлов: ${duplicateCount}`);

  // Записываем результаты в файл
  writeDuplicatesToFile('duplicate-files.md');

  const endTime = Date.now();
  console.log(`Время выполнения: ${(endTime - startTime) / 1000} секунд`);
}

// Запускаем основную функцию
main();
