#!/usr/bin/env node

/**
 * Расширенный скрипт для автоматической фиксации ошибок ESLint
 * Выполняет несколько проходов для максимальной фиксации ошибок
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Количество проходов для исправления ошибок
const MAX_PASSES = 3;

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

// Создаем временный файл конфигурации с усиленным режимом автоисправления
function createTemporaryConfig() {
  try {
    const eslintConfigPath = path.resolve(process.cwd(), '.eslintrc.js');
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

    const tempConfigPath = path.resolve(process.cwd(), '.eslintrc.temp.js');
    fs.writeFileSync(tempConfigPath, `module.exports = ${JSON.stringify(enhancedConfig, null, 2)}`);

    return tempConfigPath;
  } catch (error) {
    console.error('Ошибка при создании временной конфигурации ESLint:', error);
    process.exit(1);
  }
}

// Функция для запуска ESLint с исправлениями
function runEslintFix(configPath = null) {
  try {
    const configArg = configPath ? `--config ${configPath}` : '';
    const command = `npx eslint . --ext .ts,.tsx --fix --max-warnings=9999 ${configArg}`;

    console.log(`Выполнение команды: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });

    return output;
  } catch (error) {
    console.error('Вывод ESLint:');
    console.error(error.stdout);
    return error.stdout || '';
  }
}

// Основная функция скрипта
function main() {
  console.log('🔍 Запуск расширенного ESLint с автоматическим исправлением...');

  // Создаем временную конфигурацию ESLint
  const tempConfigPath = createTemporaryConfig();
  console.log(`✅ Создана временная конфигурация ESLint для улучшенного режима исправления`);

  let pass = 1;
  let previousErrorCount = Infinity;
  let currentErrorCount = Infinity;

  // Запускаем несколько проходов для максимального исправления ошибок
  while (pass <= MAX_PASSES && currentErrorCount > 0 && currentErrorCount < previousErrorCount) {
    console.log(`\n🔄 Запуск прохода ${pass}/${MAX_PASSES}...`);

    const output = runEslintFix(tempConfigPath);
    previousErrorCount = currentErrorCount;

    // Подсчитываем количество оставшихся ошибок
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
  console.log('\n🧹 Запуск финального прохода с оригинальной конфигурацией...');
  runEslintFix();

  // Удаляем временную конфигурацию
  try {
    fs.unlinkSync(tempConfigPath);
    console.log('🗑️ Временная конфигурация ESLint удалена');
  } catch (error) {
    console.error('Ошибка при удалении временной конфигурации:', error);
  }

  console.log('\n✅ Процесс автоматического исправления ESLint завершен!');
}

main();
