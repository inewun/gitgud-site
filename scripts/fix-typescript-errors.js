#!/usr/bin/env node

/**
 * Скрипт для фиксации типичных ошибок TypeScript
 * Автоматически исправляет некоторые распространенные ошибки типизации
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Функция для выполнения команд
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Ошибка при выполнении команды: ${command}`);
    console.error(error.message);
    return error.stdout || '';
  }
}

// Функция для поиска файлов по шаблону
async function findFiles(pattern) {
  try {
    return await glob(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
    });
  } catch (error) {
    console.error(`Ошибка при поиске файлов по шаблону ${pattern}:`, error);
    return [];
  }
}

// Функция для поиска ошибок типов в файлах
async function findTypeErrors() {
  console.log('🔍 Запуск проверки типов TypeScript...');

  const output = runCommand('npx tsc --noEmit');
  const errorRegex = /([^(]+\.[t|j]sx?)\((\d+),(\d+)\):\s+error\s+TS\d+:\s+(.+)/g;
  const errors = [];

  let match;
  while ((match = errorRegex.exec(output)) !== null) {
    errors.push({
      file: match[1],
      line: parseInt(match[2], 10),
      column: parseInt(match[3], 10),
      message: match[4],
    });
  }

  console.log(`Найдено ${errors.length} ошибок типизации`);
  return errors;
}

// Функция для исправления ошибок с any типами
async function fixAnyTypeErrors() {
  console.log('\n🛠️ Исправление типов any...');

  // Находим файлы TypeScript
  const files = await findFiles('**/*.{ts,tsx}');
  let fixedCount = 0;

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');

      // Заменяем any на более специфичные типы где возможно
      let newContent = content;

      // Замена any[] на подходящие типы массивов
      newContent = newContent.replace(/any\[\]/g, match => {
        // Анализируем контекст, чтобы предложить лучший тип
        const surroundingText = content.substring(
          Math.max(0, content.indexOf(match) - 100),
          Math.min(content.length, content.indexOf(match) + 100),
        );

        // Определяем тип на основе контекста (очень упрощенно)
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
        console.log(`✅ Исправлен файл: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка при обработке файла ${file}:`, error.message);
    }
  }

  console.log(`Исправлено ${fixedCount} файлов с any типами`);
}

// Функция для исправления ошибок импортов @/ в storybook и testing-library
async function fixImportPathErrors() {
  console.log('\n🛠️ Исправление ошибок импортов...');

  // Находим все файлы с ошибками импортов
  const files = await findFiles('**/*.{ts,tsx}');
  let fixedCount = 0;

  // Определяем маппинг неправильных/правильных путей импорта
  const importPatterns = [
    { from: /@\/storybook\/react/g, to: '@storybook/react' },
    { from: /@\/storybook\/nextjs/g, to: '@storybook/nextjs' },
    { from: /@\/testing-library\/react/g, to: '@testing-library/react' },
    { from: /@\/testing-library\/user-event/g, to: '@testing-library/user-event' },
    { from: /@\/playwright\/test/g, to: '@playwright/test' },
    { from: /@\/axe-core\/playwright/g, to: '@axe-core/playwright' },
    { from: /@\/heroicons\/react\/24\/(outline|solid)/g, to: '@heroicons/react/24/$1' },
    { from: /@\/tailwindcss\/forms/g, to: '@tailwindcss/forms' },
    { from: /@\/formatjs\/intl/g, to: '@formatjs/intl' },
    { from: /@\/trpc\/server/g, to: '@trpc/server' },
    { from: /@\/trpc\/server\/adapters\/next/g, to: '@trpc/server/adapters/next' },
    { from: /@\/jest\/globals/g, to: '@jest/globals' },
    { from: /@\/sentry\/nextjs/g, to: '@sentry/nextjs' },
    { from: /@\/hookform\/resolvers\/zod/g, to: '@hookform/resolvers/zod' },
    { from: /@\/reduxjs\/toolkit/g, to: '@reduxjs/toolkit' },
  ];

  for (const file of files) {
    try {
      // Читаем содержимое файла
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
        fixedCount++;
        console.log(`✅ Исправлены импорты в файле: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка при обработке файла ${file}:`, error.message);
    }
  }

  console.log(`Исправлено ${fixedCount} файлов с ошибками импортов`);
}

// Функция для добавления явных типов возвращаемых значений функций
async function addExplicitReturnTypes() {
  console.log('\n🛠️ Добавление явных типов возвращаемых значений...');

  // Запускаем ESLint с правилом для проверки типов возвращаемых значений
  runCommand(
    'npx eslint . --ext .ts,.tsx --fix --max-warnings=9999 --rule "@typescript-eslint/explicit-function-return-type:warn"',
  );

  console.log('✅ Завершено добавление явных типов возвращаемых значений');
}

// Функция для исправления проблем с неиспользуемыми переменными
async function fixUnusedVariables() {
  console.log('\n🛠️ Исправление неиспользуемых переменных...');

  // Запускаем ESLint с правилом для проверки неиспользуемых переменных
  runCommand(
    'npx eslint . --ext .ts,.tsx --fix --max-warnings=9999 --rule "@typescript-eslint/no-unused-vars:error"',
  );

  console.log('✅ Завершено исправление неиспользуемых переменных');
}

// Основная функция скрипта
async function main() {
  console.log('🚀 Запуск скрипта для исправления ошибок TypeScript...');

  // Шаг 1: Исправляем ошибки с any типами
  await fixAnyTypeErrors();

  // Шаг 2: Исправляем ошибки импортов
  await fixImportPathErrors();

  // Шаг 3: Добавляем явные типы возвращаемых значений
  await addExplicitReturnTypes();

  // Шаг 4: Исправляем проблемы с неиспользуемыми переменными
  await fixUnusedVariables();

  // Шаг 5: Запускаем проверку типов, чтобы увидеть оставшиеся ошибки
  const errors = await findTypeErrors();

  if (errors.length === 0) {
    console.log('\n✨ Все ошибки TypeScript исправлены!');
  } else {
    console.log(
      `\n⚠️ Осталось ${errors.length} ошибок TypeScript, которые требуют ручного исправления`,
    );
  }

  console.log('\n📝 Процесс исправления ошибок TypeScript завершен');
}

main().catch(error => {
  console.error('❌ Произошла непредвиденная ошибка:', error);
  process.exit(1);
});
