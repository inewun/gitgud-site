/**
 * Утилита для генерации компонентов по методологии FSD
 * Запуск: node scripts/generate-component.js --layer=shared --name=NewComponent --type=ui
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const minimist = require('minimist');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

// Получение аргументов командной строки
const args = minimist(process.argv.slice(2));

// Определение слоев архитектуры
const VALID_LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages'];
const VALID_TYPES = ['ui', 'lib', 'api', 'model'];

// Значения по умолчанию
const DEFAULT_LAYER = 'shared';
const DEFAULT_TYPE = 'ui';

// Получаем значения из аргументов
const layer = args.layer || DEFAULT_LAYER;
const componentName = args.name;
const type = args.type || DEFAULT_TYPE;
const isClient = args.client !== undefined;

// Проверка входных данных
if (!componentName) {
  console.error('❌ Не указано имя компонента. Используйте --name=ComponentName');
  process.exit(1);
}

if (!VALID_LAYERS.includes(layer)) {
  console.error(`❌ Некорректный слой: ${layer}. Допустимые значения: ${VALID_LAYERS.join(', ')}`);
  process.exit(1);
}

if (!VALID_TYPES.includes(type)) {
  console.error(`❌ Некорректный тип: ${type}. Допустимые значения: ${VALID_TYPES.join(', ')}`);
  process.exit(1);
}

// Определение директории
let targetDir;
if (layer === 'shared') {
  targetDir = path.join(process.cwd(), 'src', layer, type);
} else {
  targetDir = path.join(process.cwd(), 'src', layer, componentName.toLowerCase(), type);
}

if (isClient && type === 'ui') {
  targetDir = path.join(targetDir, 'client');
} else if (type === 'ui' && !isClient) {
  targetDir = path.join(targetDir, 'server');
}

/**
 * Генерирует компонент React
 */
async function generateReactComponent() {
  const componentPath = path.join(targetDir, `${componentName}.tsx`);

  // Шаблон компонента
  let template;

  if (isClient) {
    template = `'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

export interface ${componentName}Props {
  className?: string;
}

/**
 * Клиентский компонент ${componentName}
 */
const ${componentName}Base: React.FC<${componentName}Props> = ({ 
  className,
  ...props 
}) => {
  return (
    <div className={cn("", className)}>
      {/* Содержимое компонента */}
    </div>
  );
};

${componentName}Base.displayName = '${componentName}';

export const ${componentName} = withMemo(${componentName}Base);
`;
  } else {
    template = `import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface ${componentName}Props {
  className?: string;
}

/**
 * Серверный компонент ${componentName}
 */
export const ${componentName}: React.FC<${componentName}Props> = ({ 
  className,
  ...props 
}) => {
  return (
    <div className={cn("", className)}>
      {/* Содержимое компонента */}
    </div>
  );
};

${componentName}.displayName = '${componentName}';
`;
  }

  await writeFile(componentPath, template, 'utf-8');
  console.log(`✅ Создан компонент: ${componentPath}`);

  // Создаем индексный файл, если его нет
  const indexPath = path.join(targetDir, 'index.ts');
  let indexContent = `export { ${componentName} } from './${componentName}';\n`;

  if (await exists(indexPath)) {
    // Если индексный файл существует, добавляем экспорт
    const currentIndexContent = await readFile(indexPath, 'utf-8');
    if (!currentIndexContent.includes(`export { ${componentName} }`)) {
      indexContent = currentIndexContent + indexContent;
    } else {
      indexContent = currentIndexContent;
    }
  }

  await writeFile(indexPath, indexContent, 'utf-8');
  console.log(`✅ Обновлен индексный файл: ${indexPath}`);

  // Создание тестов, если это UI компонент
  if (type === 'ui') {
    await generateTest();
  }
}

/**
 * Генерирует хелпер (утилиту)
 */
async function generateHelper() {
  const helperPath = path.join(targetDir, `${componentName.toLowerCase()}.ts`);

  const template = `/**
 * Утилита ${componentName}
 * @param value Значение для обработки
 * @returns Обработанное значение
 */
export function ${componentName.charAt(0).toLowerCase() + componentName.slice(1)}(value: any): any {
  // Реализация утилиты
  return value;
}
`;

  await writeFile(helperPath, template, 'utf-8');
  console.log(`✅ Создан хелпер: ${helperPath}`);

  // Создаем индексный файл, если его нет
  const indexPath = path.join(targetDir, 'index.ts');
  let indexContent = `export { ${componentName.charAt(0).toLowerCase() + componentName.slice(1)} } from './${componentName.toLowerCase()}';\n`;

  if (await exists(indexPath)) {
    const currentIndexContent = await readFile(indexPath, 'utf-8');
    if (
      !currentIndexContent.includes(
        `export { ${componentName.charAt(0).toLowerCase() + componentName.slice(1)} }`,
      )
    ) {
      indexContent = currentIndexContent + indexContent;
    } else {
      indexContent = currentIndexContent;
    }
  }

  await writeFile(indexPath, indexContent, 'utf-8');
  console.log(`✅ Обновлен индексный файл: ${indexPath}`);
}

/**
 * Генерирует API слой (сервис)
 */
async function generateService() {
  const servicePath = path.join(targetDir, `${componentName.toLowerCase()}.service.ts`);

  const template = `/**
 * Сервис ${componentName}
 */
export const ${componentName.toLowerCase()}Service = {
  /**
   * Получить данные
   */
  async getData() {
    // Реализация сервиса
    return {};
  },
  
  /**
   * Отправить данные
   */
  async sendData(data: any) {
    // Реализация сервиса
    return { success: true };
  }
};
`;

  await writeFile(servicePath, template, 'utf-8');
  console.log(`✅ Создан сервис: ${servicePath}`);

  // Создаем индексный файл, если его нет
  const indexPath = path.join(targetDir, 'index.ts');
  let indexContent = `export { ${componentName.toLowerCase()}Service } from './${componentName.toLowerCase()}.service';\n`;

  if (await exists(indexPath)) {
    const currentIndexContent = await readFile(indexPath, 'utf-8');
    if (!currentIndexContent.includes(`export { ${componentName.toLowerCase()}Service }`)) {
      indexContent = currentIndexContent + indexContent;
    } else {
      indexContent = currentIndexContent;
    }
  }

  await writeFile(indexPath, indexContent, 'utf-8');
  console.log(`✅ Обновлен индексный файл: ${indexPath}`);
}

/**
 * Генерирует модель
 */
async function generateModel() {
  const modelPath = path.join(targetDir, `${componentName.toLowerCase()}.model.ts`);

  const template = `/**
 * Типы для ${componentName}
 */
export interface ${componentName}Entity {
  id: string;
  // Свойства модели
}

/**
 * Селекторы для ${componentName}
 */
export const ${componentName}Selectors = {
  getAll: (state: any) => state.${componentName.toLowerCase()}.items,
  getById: (state: any, id: string) => state.${componentName.toLowerCase()}.items.find((item: any) => item.id === id),
};

/**
 * Начальное состояние для ${componentName}
 */
export const ${componentName}InitialState = {
  items: [] as ${componentName}Entity[],
  loading: false,
  error: null as string | null,
};
`;

  await writeFile(modelPath, template, 'utf-8');
  console.log(`✅ Создана модель: ${modelPath}`);

  // Создаем индексный файл, если его нет
  const indexPath = path.join(targetDir, 'index.ts');
  let indexContent = `export { ${componentName}Entity, ${componentName}Selectors, ${componentName}InitialState } from './${componentName.toLowerCase()}.model';\n`;

  if (await exists(indexPath)) {
    const currentIndexContent = await readFile(indexPath, 'utf-8');
    if (!currentIndexContent.includes(`export { ${componentName}Entity`)) {
      indexContent = currentIndexContent + indexContent;
    } else {
      indexContent = currentIndexContent;
    }
  }

  await writeFile(indexPath, indexContent, 'utf-8');
  console.log(`✅ Обновлен индексный файл: ${indexPath}`);
}

/**
 * Генерирует тест для компонента
 */
async function generateTest() {
  // Создаем директорию для тестов, если ее нет
  const testDir = path.join(targetDir, '__tests__');

  try {
    await mkdir(testDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  const testPath = path.join(testDir, `${componentName}.test.tsx`);

  const template = `import React from 'react';
import { render, screen } from '@/testing-library/react';
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
  it('рендерится без ошибок', () => {
    render(<${componentName} />);
    // Проверки отображения компонента
  });

  it('принимает и применяет className', () => {
    render(<${componentName} className="test-class" />);
    // Проверка применения класса
  });
});
`;

  await writeFile(testPath, template, 'utf-8');
  console.log(`✅ Создан тест: ${testPath}`);
}

/**
 * Основная функция
 */
async function main() {
  try {
    // Создаем директории, если их нет
    await mkdir(targetDir, { recursive: true });

    // Генерируем файлы в зависимости от типа
    switch (type) {
      case 'ui':
        await generateReactComponent();
        break;
      case 'lib':
        await generateHelper();
        break;
      case 'api':
        await generateService();
        break;
      case 'model':
        await generateModel();
        break;
    }

    console.log(
      `✨ Компонент ${componentName} успешно создан в слое ${layer}/${type}${isClient ? '/client' : ''}`,
    );
  } catch (err) {
    console.error('❌ Ошибка при создании компонента:', err);
    process.exit(1);
  }
}

main();
