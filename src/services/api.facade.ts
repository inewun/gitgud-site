/**
 * API Facade - слой абстракции для работы с API
 * Централизует логику запросов к различным сервисам и предоставляет
 * унифицированный интерфейс для всех взаимодействий с API
 */

import type { UseAnonymizeOptions } from '@/domain/anonymize';
import { logger } from '@/lib/logger';

import { anonymizeService } from './anonymize.service';

/**
 * Класс-фасад для всех API сервисов приложения
 * Предоставляет единую точку доступа к различным сервисам
 */
class ApiFacade {
  /**
   * Сервис для анонимизации данных
   */
  private anonymizeService = anonymizeService;

  /**
   * URL API для внешних запросов
   */
  private apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Анонимизирует текст используя локальный сервис
   * @param text - Текст для анонимизации
   * @param options - Опции анонимизации
   * @returns Анонимизированный текст
   */
  anonymizeText(text: string, options?: Partial<UseAnonymizeOptions>): string {
    return this.anonymizeService.anonymizeText(text, options);
  }

  /**
   * Санитизирует пользовательский ввод
   * @param input - Текст для санитизации
   * @returns Санитизированный текст
   */
  sanitizeInput(input: string): string {
    return this.anonymizeService.sanitizeHtml(input);
  }

  /**
   * Получает настройки приложения с сервера
   * Пример внешнего API вызова
   * @returns Настройки приложения
   */
  async getAppSettings(): Promise<Record<string, unknown>> {
    try {
      // Проверка на наличие URL API
      if (!this.apiBaseUrl) {
        return this.getFallbackSettings();
      }

      const response = await fetch(`${this.apiBaseUrl}/settings`);
      if (!response.ok) {
        throw new Error(`API ошибка: ${response.status}`);
      }

      const data: unknown = await response.json();
      if (typeof data === 'object' && data !== null) {
        return data as Record<string, unknown>;
      }
      throw new Error('Некорректный формат данных настроек');
    } catch (error) {
      logger.error(
        'Ошибка при получении настроек',
        error instanceof Error ? error : new Error(String(error)),
      );
      return this.getFallbackSettings();
    }
  }

  /**
   * Возвращает резервные настройки при недоступности API
   * @returns Настройки по умолчанию
   */
  private getFallbackSettings(): Record<string, unknown> {
    return {
      featureFlags: {
        advancedAnonymize: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_ANONYMIZE === 'true',
        exportPdf: process.env.NEXT_PUBLIC_FEATURE_EXPORT_PDF === 'true',
      },
      themes: ['light', 'dark'],
      defaultTheme: 'light',
    };
  }
}

// Экспортируем единственный экземпляр фасада
export const apiFacade = new ApiFacade();
