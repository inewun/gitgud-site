import superjson from 'superjson';

/**
 * Сериализатор для передачи сложных типов данных через API
 *
 * SuperJSON расширяет стандартный JSON.stringify и JSON.parse для поддержки:
 * - Date и RegExp
 * - Map и Set
 * - BigInt
 * - Error
 * - Undefined и символы
 * - Circular references (циклические ссылки)
 *
 * Это обеспечивает бесшовную интеграцию между клиентом и сервером,
 * сохраняя типы данных при передаче через API.
 */
export const transformer = superjson;
