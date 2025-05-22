#!/usr/bin/env node

/**
 * Скрипт для анализа размера бандла и отслеживания регрессий
 * Проверяет размер JS, CSS и медиа-файлов после сборки и сравнивает с заданными пороговыми значениями
 * При превышении порогов выводит предупреждение и рекомендации по оптимизации
 *
 * Использование:
 * node scripts/bundle-size-analyzer.js --base=historical-sizes.json
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');
const minimist = require('minimist');

// Получаем аргументы командной строки
const args = minimist(process.argv.slice(2));
const baseFile = args.base || 'bundle-size-history.json';
const verbose = args.verbose || false;
const saveHistory = args.save !== false;

// Пороговые значения для размеров бандлов (в байтах)
const thresholds = {
  // Пороги для JS
  js: {
    total: 250 * 1024, // 250 KB
    largest: 50 * 1024, // 50 KB для самого большого файла
    initial: 120 * 1024, // 120 KB для начального загрузчика
  },
  // Пороги для CSS
  css: {
    total: 80 * 1024, // 80 KB
    largest: 30 * 1024, // 30 KB
  },
  // Пороги для изображений
  images: {
    total: 200 * 1024, // 200 KB
    largest: 100 * 1024, // 100 KB
  },
  // Пороговые значения для одной страницы
  perPage: {
    js: 150 * 1024, // 150 KB JS на страницу
    css: 50 * 1024, // 50 KB CSS на страницу
    total: 300 * 1024, // 300 KB всего на страницу
  },
};

// Директории для поиска файлов
const directories = {
  js: ['.next/static/chunks', '.next/static/runtime'],
  css: ['.next/static/css'],
  images: ['public'],
};

// Функция для рекурсивного поиска файлов с заданным расширением
function findFiles(dir, extensions) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  }

  return results;
}

// Функция для получения размера файла (обычного и gzip)
function getFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return { size: 0, gzipSize: 0 };
  }

  const content = fs.readFileSync(filePath);
  const size = content.length;
  const gzipSize = zlib.gzipSync(content).length;

  return { size, gzipSize };
}

// Функция для получения всех размеров файлов заданного типа
function getFileSizes(fileType) {
  const dirs = directories[fileType] || [];
  let extensions = [];

  switch (fileType) {
    case 'js':
      extensions = ['.js', '.mjs'];
      break;
    case 'css':
      extensions = ['.css'];
      break;
    case 'images':
      extensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
      break;
  }

  let files = [];
  for (const dir of dirs) {
    files = files.concat(findFiles(dir, extensions));
  }

  return files
    .map(file => {
      const { size, gzipSize } = getFileSize(file);
      return {
        path: file,
        name: path.basename(file),
        size,
        gzipSize,
      };
    })
    .sort((a, b) => b.size - a.size); // Сортируем по размеру (по убыванию)
}

// Функция для форматирования размера в читаемый вид
function formatSize(size) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

// Функция для проверки превышения порогов
function checkThresholds(results) {
  const issues = [];

  // Проверка JS
  if (results.js.totalSize > thresholds.js.total) {
    issues.push(
      `⚠️ Общий размер JS (${formatSize(results.js.totalSize)}) превышает порог ${formatSize(thresholds.js.total)}`,
    );
  }

  if (results.js.largestFile && results.js.largestFile.size > thresholds.js.largest) {
    issues.push(
      `⚠️ Размер самого большого JS файла (${results.js.largestFile.name}: ${formatSize(results.js.largestFile.size)}) превышает порог ${formatSize(thresholds.js.largest)}`,
    );
  }

  // Проверка CSS
  if (results.css.totalSize > thresholds.css.total) {
    issues.push(
      `⚠️ Общий размер CSS (${formatSize(results.css.totalSize)}) превышает порог ${formatSize(thresholds.css.total)}`,
    );
  }

  if (results.css.largestFile && results.css.largestFile.size > thresholds.css.largest) {
    issues.push(
      `⚠️ Размер самого большого CSS файла (${results.css.largestFile.name}: ${formatSize(results.css.largestFile.size)}) превышает порог ${formatSize(thresholds.css.largest)}`,
    );
  }

  // Проверка изображений
  if (results.images.totalSize > thresholds.images.total) {
    issues.push(
      `⚠️ Общий размер изображений (${formatSize(results.images.totalSize)}) превышает порог ${formatSize(thresholds.images.total)}`,
    );
  }

  if (results.images.largestFile && results.images.largestFile.size > thresholds.images.largest) {
    issues.push(
      `⚠️ Размер самого большого изображения (${results.images.largestFile.name}: ${formatSize(results.images.largestFile.size)}) превышает порог ${formatSize(thresholds.images.largest)}`,
    );
  }

  return issues;
}

// Функция для сравнения с историческими данными
function compareWithHistory(results, historyFile) {
  if (!fs.existsSync(historyFile)) {
    return { changes: [], hasRegressedFiles: false };
  }

  const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  const lastEntry = history[history.length - 1];

  if (!lastEntry) {
    return { changes: [], hasRegressedFiles: false };
  }

  const changes = [];
  let hasRegressedFiles = false;

  // Сравниваем общие размеры
  ['js', 'css', 'images'].forEach(type => {
    const currentTotal = results[type].totalSize;
    const previousTotal = lastEntry[type].totalSize;
    const diff = currentTotal - previousTotal;

    if (diff !== 0) {
      const percentChange = ((diff / previousTotal) * 100).toFixed(2);
      const direction = diff > 0 ? 'увеличился' : 'уменьшился';
      changes.push(
        `${type.toUpperCase()}: ${direction} на ${formatSize(Math.abs(diff))} (${Math.abs(percentChange)}%)`,
      );

      // Определяем регрессию как увеличение на 10% или более
      if (diff > 0 && percentChange >= 10) {
        hasRegressedFiles = true;
      }
    }
  });

  return { changes, hasRegressedFiles };
}

// Функция для обновления истории
function updateHistory(results, historyFile) {
  let history = [];

  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  }

  // Создаем новую запись для истории
  const newEntry = {
    date: new Date().toISOString(),
    js: {
      totalSize: results.js.totalSize,
      totalGzipSize: results.js.totalGzipSize,
      fileCount: results.js.files.length,
    },
    css: {
      totalSize: results.css.totalSize,
      totalGzipSize: results.css.totalGzipSize,
      fileCount: results.css.files.length,
    },
    images: {
      totalSize: results.images.totalSize,
      fileCount: results.images.files.length,
    },
  };

  // Добавляем новую запись и сохраняем историю
  history.push(newEntry);
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

// Генерация отчета
function generateReport(results, issues, comparison) {
  console.log('\n📦 Отчет по размеру бандла\n');

  // Общие размеры
  console.log('Общие размеры:');
  console.log(
    `  JS: ${formatSize(results.js.totalSize)} (gzip: ${formatSize(results.js.totalGzipSize)})`,
  );
  console.log(
    `  CSS: ${formatSize(results.css.totalSize)} (gzip: ${formatSize(results.css.totalGzipSize)})`,
  );
  console.log(`  Изображения: ${formatSize(results.images.totalSize)}`);
  console.log(
    `  Всего: ${formatSize(results.js.totalSize + results.css.totalSize + results.images.totalSize)}`,
  );

  // Самые большие файлы
  if (verbose) {
    console.log('\nСамые большие файлы:');

    if (results.js.largestFile) {
      console.log(
        `  JS: ${results.js.largestFile.name} - ${formatSize(results.js.largestFile.size)} (gzip: ${formatSize(results.js.largestFile.gzipSize)})`,
      );
    }

    if (results.css.largestFile) {
      console.log(
        `  CSS: ${results.css.largestFile.name} - ${formatSize(results.css.largestFile.size)} (gzip: ${formatSize(results.css.largestFile.gzipSize)})`,
      );
    }

    if (results.images.largestFile) {
      console.log(
        `  Изображение: ${results.images.largestFile.name} - ${formatSize(results.images.largestFile.size)}`,
      );
    }
  }

  // Изменения с предыдущего анализа
  if (comparison.changes.length > 0) {
    console.log('\nИзменения с предыдущего анализа:');
    comparison.changes.forEach(change => {
      console.log(`  ${change}`);
    });
  }

  // Проблемы и предупреждения
  if (issues.length > 0) {
    console.log('\n⚠️ Обнаружены проблемы:');
    issues.forEach(issue => {
      console.log(`  ${issue}`);
    });

    console.log('\n🔧 Рекомендации по оптимизации:');
    console.log(
      '  - Используйте разделение кода (code splitting) для уменьшения размера начальной загрузки',
    );
    console.log('  - Внедрите отложенную загрузку (lazy loading) для неприоритетных компонентов');
    console.log('  - Оптимизируйте изображения (сжатие, правильный формат, WebP)');
    console.log('  - Проверьте наличие неиспользуемого кода с помощью инструментов анализа бандла');
    console.log('  - Рассмотрите использование tree-shaking для удаления мертвого кода');
  } else {
    console.log('\n✅ Все проверки пройдены успешно!');
  }
}

// Основная функция
async function main() {
  console.log('🔍 Анализ размера бандла...\n');

  try {
    // Проверяем, была ли выполнена сборка
    if (!fs.existsSync('.next')) {
      console.log('📝 Сборка проекта не найдена, выполнение команды build...');
      execSync('npm run build', { stdio: 'inherit' });
    }

    // Получаем размеры файлов
    const jsFiles = getFileSizes('js');
    const cssFiles = getFileSizes('css');
    const imageFiles = getFileSizes('images');

    // Суммируем размеры
    const results = {
      js: {
        files: jsFiles,
        totalSize: jsFiles.reduce((sum, file) => sum + file.size, 0),
        totalGzipSize: jsFiles.reduce((sum, file) => sum + file.gzipSize, 0),
        largestFile: jsFiles.length > 0 ? jsFiles[0] : null,
      },
      css: {
        files: cssFiles,
        totalSize: cssFiles.reduce((sum, file) => sum + file.size, 0),
        totalGzipSize: cssFiles.reduce((sum, file) => sum + file.gzipSize, 0),
        largestFile: cssFiles.length > 0 ? cssFiles[0] : null,
      },
      images: {
        files: imageFiles,
        totalSize: imageFiles.reduce((sum, file) => sum + file.size, 0),
        largestFile: imageFiles.length > 0 ? imageFiles[0] : null,
      },
    };

    // Проверяем превышение порогов
    const issues = checkThresholds(results);

    // Сравниваем с историей
    const comparison = compareWithHistory(results, baseFile);

    // Обновляем историю, если требуется
    if (saveHistory) {
      updateHistory(results, baseFile);
    }

    // Генерируем отчет
    generateReport(results, issues, comparison);

    // Возвращаем статус в зависимости от результатов
    const hasIssues = issues.length > 0 || comparison.hasRegressedFiles;
    process.exit(hasIssues ? 1 : 0);
  } catch (error) {
    console.error('❌ Ошибка при анализе размера бандла:', error);
    process.exit(1);
  }
}

// Запускаем основную функцию
main();
