/**
 * Скрипт для добавления атрибутов доступности к NextJS диалогам ошибок
 * Решает проблемы с доступностью:
 * 1. Добавляет атрибут aria-label к диалогам без него
 * 2. Исправляет проблемы с tabindex
 */

(function fixNextJSDialogAccessibility() {
  // Запускаем скрипт после загрузки страницы
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      // Наблюдатель изменения DOM для поиска диалогов NextJS, добавляемых динамически
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              // Проверяем, добавились ли новые диалоги
              if (node.nodeType === Node.ELEMENT_NODE) {
                fixDialogs();
              }
            });
          }
        });
      });

      // Начинаем наблюдение за изменениями в DOM
      observer.observe(document.body, { childList: true, subtree: true });

      // Первичная проверка диалогов при загрузке
      fixDialogs();

      // Функция для исправления диалогов
      function fixDialogs() {
        // Находим все диалоги от NextJS
        const nextJSDialogs = document.querySelectorAll('[data-nextjs-dialog="true"]');

        nextJSDialogs.forEach(dialog => {
          // Добавляем aria-label, если его нет
          if (!dialog.getAttribute('aria-label')) {
            dialog.setAttribute('aria-label', 'NextJS Error Dialog');
          }

          // Проверяем атрибут tabindex в дочерних элементах
          const elementsWithTabindex = dialog.querySelectorAll('[tabindex]');
          elementsWithTabindex.forEach(element => {
            const tabindex = element.getAttribute('tabindex');
            // Если tabindex больше 0, исправляем его на 0
            if (tabindex && parseInt(tabindex, 10) > 0) {
              element.setAttribute('tabindex', '0');
            }
          });
        });
      }
    });
  }
})();
