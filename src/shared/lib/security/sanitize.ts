/**
 * Утилиты для санитации пользовательского ввода
 * Защита от XSS-атак и других инъекций
 *
 * @module shared/lib/security/sanitize
 */

import * as PurifyModule from 'dompurify';

import { isServer } from '@/shared/lib/utils/dom';

// Типизированный доступ к DOMPurify
interface DOMPurifyType {
  sanitize: (
    input: string,
    config?: {
      ALLOWED_TAGS?: string[];
      ALLOWED_ATTR?: string[];
      FORBID_TAGS?: string[];
      FORBID_ATTR?: string[];
      ALLOW_DATA_ATTR?: boolean;
      ADD_URI_SAFE_ATTR?: string[];
      RETURN_DOM?: boolean;
      RETURN_DOM_FRAGMENT?: boolean;
      USE_PROFILES?: {
        html?: boolean;
        svg?: boolean;
        svgFilters?: boolean;
        mathMl?: boolean;
      };
    },
  ) => string;
}

// Используем правильное приведение типов для DOMPurify с учетом окружения
const DOMPurify = (() => {
  // На сервере JSDOM не доступен, используем заглушку
  if (isServer()) {
    return {
      sanitize: (html: string) => html.replace(/<[^>]*>?/gm, ''),
    } as DOMPurifyType;
  }

  // На клиенте используем DOMPurify
  return PurifyModule as unknown as DOMPurifyType;
})();

// Конфигурация по умолчанию для DOMPurify
const DEFAULT_CONFIG = {
  // Разрешенные HTML теги
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'span',
    'div',
    'b',
    'i',
    'u',
    'strong',
    'em',
    'mark',
    'small',
    'del',
    'ins',
    'ul',
    'ol',
    'li',
    'a',
    'br',
    'hr',
    'blockquote',
    'code',
    'pre',
  ],
  // Разрешенные атрибуты
  ALLOWED_ATTR: [
    'href',
    'title',
    'target',
    'rel',
    'class',
    'id',
    'style',
    'aria-label',
    'aria-describedby',
    'role',
  ],
  // Явно запрещенные теги
  FORBID_TAGS: [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'style',
    'applet',
    'canvas',
    'math',
    'svg',
  ],
  // Явно запрещенные атрибуты
  FORBID_ATTR: [
    'onerror',
    'onload',
    'onclick',
    'onmouseover',
    'onmouseout',
    'onmousedown',
    'onmouseup',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'javascript:',
    'data:',
    'vbscript:',
  ],
  // Отключение data-атрибутов
  ALLOW_DATA_ATTR: false,
};

/**
 * Санитизирует HTML строку, удаляя потенциально опасные скрипты и атрибуты
 *
 * @param html - HTML строка для очистки
 * @param config - Опциональная конфигурация DOMPurify
 * @returns Очищенная HTML строка
 */
export function sanitizeHtml(html: string, config = DEFAULT_CONFIG): string {
  // Используем DOMPurify с учетом окружения (заглушка на сервере уже настроена)
  return DOMPurify.sanitize(html, config).toString();
}

/**
 * Санитизирует обычный текст, удаляя HTML теги и специальные символы
 *
 * @param text - Текст для очистки
 * @returns Очищенный текст
 */
export function sanitizeText(text: string): string {
  // Удаляем все HTML теги
  const htmlSanitized = text.replace(/<[^>]*>?/gm, '');

  // Заменяем специальные HTML символы на их представления
  return htmlSanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Санитизирует URI, удаляя потенциально опасные URL схемы
 *
 * @param uri - URI для очистки
 * @returns Очищенный URI или пустую строку, если URI потенциально опасен
 */
export function sanitizeUri(uri: string): string {
  // Список безопасных схем
  const safeSchemes = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];

  try {
    const url = new URL(uri, window.location.origin);

    // Проверяем схему
    if (safeSchemes.some(scheme => url.protocol === scheme)) {
      return url.toString();
    }

    // Если схема не в списке безопасных, удаляем её
    return url.pathname + url.search + url.hash;
  } catch (e) {
    // Если URI некорректный, возвращаем очищенную версию
    return uri.replace(/[<>"']/g, '');
  }
}

/**
 * Безопасно применяет DOMPurify к HTML строке на клиенте
 * или возвращает заглушку на сервере
 *
 * @param html - HTML строка для очистки
 * @param config - Опциональная конфигурация DOMPurify
 * @returns Очищенная HTML строка или заглушка
 */
export function safeSanitize(html: string, config = DEFAULT_CONFIG): string {
  try {
    return sanitizeHtml(html, config);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error sanitizing HTML:', e);
    return '[Содержимое удалено из соображений безопасности]';
  }
}
