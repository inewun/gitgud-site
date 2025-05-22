#!/usr/bin/env node

/**
 * Скрипт для анализа компонентов React и применения withMemo к компонентам,
 * которые еще не используют его.
 * Запуск: node scripts/apply-memo.js [--apply]
 * Без флага --apply только анализирует и выводит список компонентов, к которым нужно применить withMemo
 * С флагом --apply вносит изменения в файлы
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const minimist = require('minimist');

// Аргументы командной строки
const args = minimist(process.argv.slice(2), {
  boolean: ['apply'],
  default: { apply: false },
});

// Пути для поиска компонентов
const directories = ['src/shared/ui', 'src/features', 'src/widgets', 'src/entities'];

// Регулярные выражения для поиска компонентов
const componentRegex = /export\s+(?:const|function)\s+([A-Z][A-Za-z0-9]*)\s*(?:=|:)/g;
const memoImportRegex = /import\s+{.*?withMemo.*?}\s+from\s+['"](.*?)['"]/;
const memoUsageRegex = /export\s+const\s+([A-Z][A-Za-z0-9]*)\s*=\s*withMemo\(/g;
const memoDirectUsageRegex = /export\s+const\s+([A-Z][A-Za-z0-9]*)\s*=\s*memo\(/g;

// Компоненты, которые намеренно исключаются из мемоизации
const excludeComponents = ['Provider', 'Context', 'Layout', 'Page', 'Root', 'App', 'ErrorBoundary'];

// Найти все файлы компонентов
const componentFiles = [];
directories.forEach(dir => {
  componentFiles.push(...glob.sync(`${dir}/**/*.{tsx,jsx}`));
});

// Результаты анализа
const needsMemo = [];
const alreadyHasMemo = [];
const directMemo = [];

// Анализ каждого файла
componentFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  // Пропускаем файлы тестов и историй Storybook
  if (
    fileName.includes('.test.') ||
    fileName.includes('.spec.') ||
    fileName.includes('.stories.')
  ) {
    return;
  }

  // Находим имена экспортируемых компонентов
  const componentMatches = [...content.matchAll(componentRegex)];
  const hasMemoImport = memoImportRegex.test(content);
  const memoUsageMatches = [...content.matchAll(memoUsageRegex)];
  const memoDirectUsageMatches = [...content.matchAll(memoDirectUsageRegex)];

  // Компоненты с withMemo
  const withMemoComponents = memoUsageMatches.map(match => match[1]);

  // Компоненты с прямым использованием memo
  const withDirectMemoComponents = memoDirectUsageMatches.map(match => match[1]);

  // Фильтруем компоненты, которые нужно обрабатывать
  componentMatches.forEach(match => {
    const componentName = match[1];
    // Пропускаем компоненты из исключений и внутренние компоненты (начинающиеся с маленькой буквы)
    if (
      excludeComponents.some(exclude => componentName.includes(exclude)) ||
      !componentName.match(/^[A-Z]/)
    ) {
      return;
    }

    // Проверяем, использует ли компонент уже withMemo
    if (withMemoComponents.includes(componentName)) {
      alreadyHasMemo.push({ filePath, componentName });
    }
    // Проверяем, использует ли компонент напрямую React.memo или memo
    else if (
      withDirectMemoComponents.includes(componentName) ||
      content.includes(`memo(${componentName})`)
    ) {
      directMemo.push({ filePath, componentName });
    }
    // Компонент нуждается в withMemo
    else {
      needsMemo.push({ filePath, componentName });
    }
  });
});

// Вывод результатов анализа
console.log(`\n=== Результаты анализа ===`);
console.log(`Найдено ${componentFiles.length} файлов компонентов`);
console.log(`${alreadyHasMemo.length} компонентов уже используют withMemo`);
console.log(`${directMemo.length} компонентов используют memo напрямую`);
console.log(`${needsMemo.length} компонентов нуждаются в withMemo\n`);

// Вывод компонентов, нуждающихся в withMemo
console.log(`=== Компоненты, нуждающиеся в withMemo ===`);
needsMemo.forEach(({ filePath, componentName }) => {
  console.log(`${componentName} в ${filePath}`);
});

// Применение withMemo, если указан флаг --apply
if (args.apply && needsMemo.length > 0) {
  console.log(`\n=== Применение withMemo к ${needsMemo.length} компонентам ===`);

  needsMemo.forEach(({ filePath, componentName }) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Добавляем импорт withMemo, если его нет
    if (!memoImportRegex.test(content)) {
      // Проверяем, какой путь импорта использовать
      let importPath = '';
      if (filePath.includes('src/shared/ui')) {
        importPath = '../performance/withMemo';
      } else {
        importPath = '@/lib/utils/memo';
      }

      // Добавляем импорт после других импортов
      const importSection = content.match(/(import\s+.*?['"];?\n)+/s);
      if (importSection) {
        const newImport = `import { withMemo } from '${importPath}';\n`;
        content = content.replace(importSection[0], importSection[0] + newImport);
      }
    }

    // Заменяем экспорт компонента
    const componentExportRegex = new RegExp(
      `export\\s+(const|function)\\s+${componentName}\\s*(?:=|:)`,
      'g',
    );

    // Проверяем, является ли компонент function или const
    if (content.match(new RegExp(`export\\s+function\\s+${componentName}\\s*\\(`))) {
      // Для function-компонентов
      const funcRegex = new RegExp(
        `export\\s+function\\s+${componentName}\\s*\\(([\\s\\S]*?)\\)\\s*{([\\s\\S]*?)\\n}`,
      );
      const match = content.match(funcRegex);

      if (match) {
        const params = match[1];
        const body = match[2];

        // Создаем базовый компонент и применяем withMemo
        const replacement =
          `function ${componentName}Base(${params}) {${body}\n}\n\n` +
          `${componentName}Base.displayName = '${componentName}Base';\n\n` +
          `export const ${componentName} = withMemo(${componentName}Base);`;

        content = content.replace(funcRegex, replacement);
      }
    } else {
      // Для const-компонентов
      // Находим строку с export const ComponentName = ...
      const constRegex = new RegExp(`export\\s+const\\s+${componentName}\\s*=\\s*([^;]+)`, 's');
      const match = content.match(constRegex);

      if (match) {
        const componentDefinition = match[1];
        // Создаем базовый компонент и применяем withMemo
        const baseComponentName = `${componentName}Base`;
        const replacement =
          `const ${baseComponentName} = ${componentDefinition}\n\n` +
          `${baseComponentName}.displayName = '${baseComponentName}';\n\n` +
          `export const ${componentName} = withMemo(${baseComponentName});`;

        content = content.replace(constRegex, replacement);
      }
    }

    // Записываем изменения в файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Применен withMemo к ${componentName} в ${filePath}`);
  });

  console.log(`\n=== Завершено! ===`);
} else if (args.apply) {
  console.log(`\n=== Нет компонентов для обновления ===`);
} else {
  console.log(`\n=== Для применения изменений запустите скрипт с флагом --apply ===`);
}
