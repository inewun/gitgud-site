#!/usr/bin/env node

/**
 * Обертка для запуска bundle-size-analyzer.js с параметрами
 *
 * Использование:
 * node scripts/run-analyzer.js [--base=path/to/historical-sizes.json] [--threshold=10]
 */

const { spawn } = require('child_process');
const path = require('path');

// Передаем все аргументы команды в bundle-size-analyzer.js
const args = process.argv.slice(2);

// Формируем путь к скрипту bundle-size-analyzer.js
const analyzerPath = path.join(__dirname, 'bundle-size-analyzer.js');

// Запускаем скрипт
const analyzer = spawn('node', [analyzerPath, ...args], {
  stdio: 'inherit',
  shell: true,
});

// Обработка завершения процесса
analyzer.on('close', code => {
  process.exit(code);
});

// Обработка ошибок
analyzer.on('error', err => {
  console.error('Ошибка при запуске bundle-size-analyzer.js:', err);
  process.exit(1);
});
