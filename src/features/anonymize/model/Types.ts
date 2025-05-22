/**
 * Реэкспорт типов из доменного слоя
 * для обеспечения совместимости и единого API
 */
export type { UseAnonymizeOptions, AnonymizeError } from '@/domain/anonymize';

/**
 * Результат операции анонимизации в рамках фичи
 */
export interface AnonymizeResult {
  text: string;
  success: boolean;
  error?: string;
  stats?: {
    replacedItems: number;
    executionTime: number;
  };
}
