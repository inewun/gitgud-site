/**
 * Скрипт для автоматического обновления импортов при миграции компонентов UI
 *
 * Использование:
 * node scripts/update-imports.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Таблица маппинга путей компонентов (старый путь -> новый путь)
const COMPONENT_MAPPING = {
  'shared/ui/button/Button': 'shared/ui/inputs/button/Button',
  'shared/ui/card/Card': 'shared/ui/layout/card/Card',
  'shared/ui/inputs/Checkbox': 'shared/ui/inputs/checkbox/Checkbox',
  'shared/ui/inputs/Select': 'shared/ui/inputs/select/Select',
  'shared/ui/inputs/TextInputField': 'shared/ui/inputs/text-field/TextInputField',
  'shared/ui/inputs/TextareaField': 'shared/ui/inputs/textarea/TextareaField',
  'shared/ui/navigation/NavigationMenu': 'shared/ui/navigation/menu/NavigationMenu',
  'shared/ui/navigation/Header': 'shared/ui/navigation/header/Header',
  'shared/ui/layout/Footer': 'shared/ui/layout/footer/Footer',
  'shared/ui/layout/FooterPlaceholder': 'shared/ui/layout/footer/FooterPlaceholder',
  'shared/ui/card/ResultContainer': 'shared/ui/layout/card/ResultContainer',
  'shared/ui/card/ResultHeader': 'shared/ui/layout/card/ResultHeader',
  'shared/ui/card/PreformattedText': 'shared/ui/typography/PreformattedText',
  'shared/ui/media/Icon': 'shared/ui/media/icon/Icon',
  'shared/ui/media/Image': 'shared/ui/media/image/Image',
  'shared/ui/feedback/ThemeToggle': 'shared/ui/feedback/theme-toggle/ThemeToggle',
  'shared/ui/feedback/ErrorBoundary': 'shared/ui/feedback/error-boundary/ErrorBoundary',
  'shared/ui/accessibility/SkipLink': 'shared/ui/navigation/skip-link/SkipLink',
  'shared/ui/accessibility/MobileNavigation':
    'shared/ui/navigation/mobile-navigation/MobileNavigation',
  'shared/ui/AccessibleFocus': 'shared/ui/utils/accessible-focus/AccessibleFocus',
  'shared/ui/animations/Motion': 'shared/ui/utils/motion/Motion',
  'shared/ui/virtualization/VirtualList': 'shared/ui/data-display/virtual-list/VirtualList',
  'shared/ui/providers/ThemeProvider': 'shared/ui/theme/providers/ThemeProvider',
  'shared/ui/preload/FontPreloader': 'shared/ui/utils/preload/FontPreloader',
  'shared/ui/performance/LazyComponent': 'shared/ui/utils/lazy-component/LazyComponent',
  'shared/ui/performance/DynamicImport': 'shared/ui/utils/dynamic-import/DynamicImport',
  'shared/ui/performance/Analytics': 'shared/ui/utils/analytics/Analytics',
  'shared/ui/performance/Profiler': 'shared/ui/utils/profiler/Profiler',
  'shared/ui/hydration/PartialHydration': 'shared/ui/utils/hydration/PartialHydration',
  'shared/ui/client/GenericComponent': 'shared/ui/utils/generic-component/GenericComponent',
  'shared/ui/client/TestComponent': 'shared/ui/utils/test-component/TestComponent',
  'shared/ui/server/ServerComponent': 'shared/ui/utils/server-component/ServerComponent',
  'shared/ui/ErrorBoundary': 'shared/ui/feedback/error-boundary/ErrorBoundary',
};

// Директории, которые следует исключить из проверки
const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'build', 'dist'];

// Расширения файлов, которые следует проверять
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Проверяет, нужно ли обрабатывать файл
 * @param {string} filePath Путь к файлу
 * @returns {boolean}
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return FILE_EXTENSIONS.includes(ext);
}

/**
 * Обновляет импорты в файле
 * @param {string} filePath Путь к файлу
 * @param {string} content Содержимое файла
 * @returns {string} Обновленное содержимое файла
 */
function updateImports(filePath, content) {
  let updated = content;
  let hasChanges = false;

  // Ищем все импорты
  Object.entries(COMPONENT_MAPPING).forEach(([oldPath, newPath]) => {
    // Создаем регулярное выражение для поиска импортов
    // Оно должно учитывать различные форматы импортов
    const importRegex = new RegExp(
      `(from\\s+['"])([^'"]*/${oldPath.replace(/\//g, '\\/').replace(/\./g, '\\.')})(["'])`,
    );
    const reexportRegex = new RegExp(
      `(export\\s+(?:type\\s+)?(?:\\{[^}]*\\}\\s+from\\s+['"])([^'"]*/${oldPath.replace(/\//g, '\\/').replace(/\./g, '\\.')})(["']))`,
    );

    // Ищем и заменяем импорты
    if (importRegex.test(updated)) {
      updated = updated.replace(importRegex, `$1${newPath}$3`);
      hasChanges = true;
      console.log(`[${filePath}] Обновлен импорт: ${oldPath} -> ${newPath}`);
    }

    // Ищем и заменяем реэкспорты
    if (reexportRegex.test(updated)) {
      updated = updated.replace(reexportRegex, `$1${newPath}$3`);
      hasChanges = true;
      console.log(`[${filePath}] Обновлен реэкспорт: ${oldPath} -> ${newPath}`);
    }
  });

  return hasChanges ? updated : null;
}

/**
 * Рекурсивно обрабатывает все файлы в директории
 * @param {string} directory Путь к директории
 */
async function processDirectory(directory) {
  try {
    const files = await readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await stat(filePath);

      if (stats.isDirectory() && !EXCLUDED_DIRS.includes(file)) {
        // Рекурсивно обрабатываем поддиректории
        await processDirectory(filePath);
      } else if (stats.isFile() && shouldProcessFile(filePath)) {
        // Обрабатываем файл
        const content = await readFile(filePath, 'utf8');
        const updatedContent = updateImports(filePath, content);

        if (updatedContent) {
          // Записываем изменения только если были обновления
          await writeFile(filePath, updatedContent, 'utf8');
          console.log(`Обновлен файл: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Ошибка при обработке директории ${directory}:`, error);
  }
}

/**
 * Основная функция
 */
async function main() {
  try {
    console.log('Запуск обновления импортов...');
    const rootDir = path.resolve(__dirname, '..');
    await processDirectory(rootDir);
    console.log('Обновление импортов завершено.');
  } catch (error) {
    console.error('Ошибка при обновлении импортов:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
main();
