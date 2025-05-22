import { z, ZodError } from 'zod';

import { AnonymizeError, AnonymizeErrorType } from '@/features/anonymize/api/anonymize.types';
import { anonymize } from '@/features/anonymize/core/anonymizer';
import { sanitizeInput } from '@/features/anonymize/core/sanitizer';
import { UseAnonymizeOptions } from '@/features/anonymize/hooks/useAnonymize';
import { AnonymizeResult } from '@/features/anonymize/ui/server/ResultsList';

// Схема валидации для запроса на сохранение
const saveAnonymizeRequestSchema = z.object({
  originalText: z.string().min(1, 'Исходный текст не может быть пустым'),
  anonymizedText: z.string(),
  metadata: z.record(z.number()).optional(),
});

// Схема валидации для ответа при сохранении
const saveAnonymizeResponseSchema = z.object({
  success: z.boolean(),
  id: z.string().optional(),
  timestamp: z.string().optional(),
  error: z.string().optional(),
});

// Схема валидации для одного результата в истории
const anonymizeResultSchema = z.object({
  id: z.string(),
  originalText: z.string(),
  anonymizedText: z.string(),
  timestamp: z.string(), // ISO 8601 date string
  metadata: z.record(z.number()).optional(),
});

// Схема валидации для ответа истории
const getAnonymizeHistoryResponseSchema = z.object({
  success: z.boolean(),
  results: z.array(anonymizeResultSchema).optional(),
  error: z.string().optional(),
});

export { AnonymizeErrorType };
export type { AnonymizeError, AnonymizeResult };

class AnonymizeService {
  /**
   * Проверяет текст на валидность
   * @param text Текст для проверки
   * @throws {AnonymizeError} Ошибка при валидации
   */
  private validateInput(text: string): void {
    if (!text || !text.trim()) {
      const error = this.createError(
        AnonymizeErrorType.VALIDATION,
        'Текст для анонимизации не может быть пустым',
        'Пожалуйста, введите текст для анонимизации.',
      );
      throw new Error(error.message);
    }
  }

  /**
   * Преобразует опции из UI формата в domain формат
   * @param options Опции анонимизации
   * @returns Опции в формате domain
   */
  private convertToDomainOptions(options: Partial<UseAnonymizeOptions>): Record<string, boolean> {
    return {
      replaceNames: options.anonymizeNames ?? true,
      replaceEmails: options.anonymizeEmails ?? false,
      replacePhones: options.anonymizePhones ?? true,
      replaceDates: false,
      replaceAddresses: false,
      replaceIPs: false,
    };
  }

  /**
   * Получает результирующий текст из анонимизированного результата
   * @param anonymizeResult Результат анонимизации
   * @param originalText Оригинальный текст
   * @returns Анонимизированный текст
   */
  private extractAnonymizedText(anonymizeResult: unknown, originalText: string): string {
    if (typeof anonymizeResult === 'string') {
      return anonymizeResult;
    }

    if (
      anonymizeResult &&
      typeof anonymizeResult === 'object' &&
      'anonymizedText' in anonymizeResult
    ) {
      return (anonymizeResult as { anonymizedText: string }).anonymizedText;
    }

    return originalText; // Возвращаем исходный текст, если анонимизация не удалась
  }

  /**
   * Обрабатывает ошибки, возникшие при анонимизации
   * @param error Возникшая ошибка
   * @throws {AnonymizeError} Оформленная ошибка
   */
  private handleAnonymizeError(error: unknown): never {
    // Обработка известных ошибок валидации или санитизации
    if (error instanceof ZodError) {
      const customError = this.createError(
        AnonymizeErrorType.VALIDATION,
        `Ошибка валидации: ${error.message}`,
        'Пожалуйста, проверьте корректность введенных данных',
        error.errors,
      );
      throw new Error(customError.message);
    }

    // Наши собственные ошибки пробрасываем дальше
    if (typeof error === 'object' && error !== null && 'type' in error) {
      throw new Error((error as AnonymizeError).message);
    }

    const customError = this.createError(
      AnonymizeErrorType.UNKNOWN,
      `Ошибка при анонимизации текста: ${(error as Error).message || 'Неизвестная ошибка'}`,
      'Не удалось анонимизировать текст. Пожалуйста, попробуйте снова или обратитесь в поддержку.',
    );
    throw new Error(customError.message);
  }

  /**
   * Подготовка текста к анонимизации
   * @param text Текст для анонимизации
   * @param options Опции анонимизации
   * @returns Промежуточный результат для дальнейшей обработки
   */
  private prepareForAnonymization(
    text: string,
    options: Partial<UseAnonymizeOptions> = {},
  ): {
    text: string;
    domainOptions: Record<string, boolean>;
  } {
    // 1. Валидация входных данных
    this.validateInput(text);

    // 2. Преобразование параметров
    const domainOptions = this.convertToDomainOptions(options);

    return { text, domainOptions };
  }

  /**
   * Выполнение анонимизации текста
   * @param text Текст для анонимизации
   * @param domainOptions Опции в формате domain
   * @returns Анонимизированный текст
   */
  private performAnonymization(text: string, domainOptions: Record<string, boolean>): string {
    // 3. Анонимизация текста
    const anonymizeResult = anonymize(text, domainOptions);

    // 4. Извлечение текста из результата
    const anonymizedText = this.extractAnonymizedText(anonymizeResult, text);

    // 5. Санитизация результата
    return sanitizeInput(anonymizedText);
  }

  /**
   * Анонимизирует текст, используя основные функции
   * @param text Текст для анонимизации
   * @param options Опции анонимизации
   * @returns Анонимизированный текст
   * @throws {AnonymizeError} Ошибка при анонимизации
   */
  anonymizeText(text: string, options: Partial<UseAnonymizeOptions> = {}): string {
    try {
      const { text: validatedText, domainOptions } = this.prepareForAnonymization(text, options);
      return this.performAnonymization(validatedText, domainOptions);
    } catch (error: unknown) {
      // 6. Обработка ошибок
      this.handleAnonymizeError(error);
    }
  }

  /**
   * Санитизирует пользовательский ввод для предотвращения XSS
   * @param input Текст для санитизации
   * @returns Санитизированный текст
   * @throws {AnonymizeError} Ошибка при санитизации
   */
  sanitizeInput(input: string): string {
    try {
      return sanitizeInput(input);
    } catch (error: unknown) {
      const customError = this.createError(
        AnonymizeErrorType.VALIDATION,
        `Ошибка при санитизации текста: ${(error as Error).message || 'Неизвестная ошибка'}`,
        'Произошла ошибка при обработке текста. Пожалуйста, проверьте входные данные.',
      );
      throw new Error(customError.message);
    }
  }

  /**
   * Получает список результатов анонимизации
   * @returns Массив результатов анонимизации
   * @throws {AnonymizeError} Ошибка при получении результатов
   */
  async getAnonymizeResults(): Promise<AnonymizeResult[]> {
    try {
      // Запрос к новому API роуту App Router
      const response = await fetch('/api/anonymize/history');

      if (!response.ok) {
        this.handleApiResponseError(response.status, 'получении');
      }

      const rawData: unknown = await response.json();

      // Валидируем ответ с помощью Zod
      const data = getAnonymizeHistoryResponseSchema.parse(rawData);

      if (!data.success) {
        const customError = this.createError(
          AnonymizeErrorType.SERVER,
          `Ошибка при получении истории: ${data.error || 'Неизвестная ошибка'}`,
          'Не удалось загрузить историю анонимизации. Пожалуйста, попробуйте позже.',
        );
        throw new Error(customError.message);
      }

      // Приводим типы к ожидаемым в AnonymizeResult
      return this.mapHistoryResults(data.results || []);
    } catch (error: unknown) {
      // Обрабатываем разные типы ошибок
      this.handleCatchError(error, 'получении результатов анонимизации');
    }
  }

  /**
   * Преобразует результаты из API в формат AnonymizeResult
   */
  private mapHistoryResults(results: z.infer<typeof anonymizeResultSchema>[]): AnonymizeResult[] {
    return results.map(result => ({
      id: result.id || '', // Обеспечиваем, что id всегда строка, не undefined
      timestamp: result.timestamp || '',
      originalText: result.originalText,
      anonymizedText: result.anonymizedText,
      metadata: result.metadata,
    }));
  }

  /**
   * Обрабатывает ошибки ответа API на основе статус-кода
   */
  private handleApiResponseError(statusCode: number, _operation: string): never {
    if (statusCode === 401 || statusCode === 403) {
      const customError = this.createError(
        AnonymizeErrorType.AUTH,
        `Ошибка авторизации: ${statusCode}`,
        'У вас нет доступа к этому ресурсу. Пожалуйста, войдите в систему.',
      );
      throw new Error(customError.message);
    }

    if (statusCode >= 500) {
      const customError = this.createError(
        AnonymizeErrorType.SERVER,
        `Ошибка сервера: ${statusCode}`,
        'Сервер временно недоступен. Пожалуйста, попробуйте позже.',
      );
      throw new Error(customError.message);
    }

    const customError = this.createError(
      AnonymizeErrorType.NETWORK,
      `Ошибка сети: ${statusCode}`,
      'Возникла проблема с сетевым подключением. Проверьте ваше соединение и попробуйте снова.',
    );
    throw new Error(customError.message);
  }

  /**
   * Обработка ошибок в блоке catch
   */
  private handleCatchError(error: unknown, operation: string): never {
    // Ошибки валидации от Zod обрабатываем отдельно
    if (error instanceof ZodError) {
      const customError = this.createError(
        AnonymizeErrorType.VALIDATION,
        `Ошибка валидации данных от сервера: ${error.message}`,
        'Получены некорректные данные от сервера. Пожалуйста, попробуйте позже.',
        error.errors,
      );
      throw new Error(customError.message);
    }

    // Наши собственные ошибки пробрасываем дальше
    if (typeof error === 'object' && error !== null && 'type' in error) {
      throw new Error((error as AnonymizeError).message);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      const customError = this.createError(
        AnonymizeErrorType.NETWORK,
        `Ошибка сети: ${error.message}`,
        'Не удалось подключиться к серверу. Пожалуйста, проверьте соединение и попробуйте снова.',
      );
      throw new Error(customError.message);
    }

    const customError = this.createError(
      AnonymizeErrorType.UNKNOWN,
      `Ошибка при ${operation}: ${(error as Error).message || 'Неизвестная ошибка'}`,
      'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.',
    );
    throw new Error(customError.message);
  }

  /**
   * Сохраняет результат анонимизации в историю
   * @param originalText Исходный текст
   * @param anonymizedText Анонимизированный текст
   * @param metadata Метаданные о замененных элементах
   * @returns Идентификатор сохраненной записи
   * @throws {AnonymizeError} Ошибка при сохранении результата
   */
  async saveAnonymizeResult(
    originalText: string,
    anonymizedText: string,
    metadata?: Record<string, number>,
  ): Promise<{ id: string; timestamp: string } | null> {
    try {
      // Валидируем входные данные с помощью Zod
      const validatedData = saveAnonymizeRequestSchema.parse({
        originalText,
        anonymizedText,
        metadata,
      });

      const response = await fetch('/api/anonymize/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        this.handleApiResponseError(response.status, 'сохранении');
      }

      return this.processSaveResponse(await response.json());
    } catch (error: unknown) {
      // Обрабатываем разные типы ошибок
      this.handleCatchError(error, 'сохранении результата анонимизации');
    }
  }

  /**
   * Обрабатывает ответ от сервера при сохранении результата
   */
  private processSaveResponse(rawData: unknown): { id: string; timestamp: string } {
    // Валидируем ответ с помощью Zod
    const data = saveAnonymizeResponseSchema.parse(rawData);

    if (!data.success) {
      const customError = this.createError(
        AnonymizeErrorType.SERVER,
        `Ошибка при сохранении результата: ${data.error || 'Неизвестная ошибка'}`,
        'Не удалось сохранить результат анонимизации. Пожалуйста, попробуйте позже.',
      );
      throw new Error(customError.message);
    }

    if (!data.id || !data.timestamp) {
      // Создаем объект ошибки, чтобы получить сообщение
      const errorDetails = this.createError(
        AnonymizeErrorType.SERVER,
        'Сервер вернул неполные данные после сохранения',
        'Не удалось получить информацию о сохраненном результате. Пожалуйста, попробуйте позже.',
      );
      // Выбрасываем стандартную ошибку с сообщением из нашего объекта
      throw new Error(errorDetails.message);
    }

    return {
      id: data.id,
      timestamp: data.timestamp,
    };
  }

  /**
   * Создает объект ошибки с заданным типом и сообщением
   * @param type Тип ошибки
   * @param message Техническое сообщение об ошибке
   * @param userMessage Сообщение для пользователя
   * @param details Дополнительные детали ошибки
   * @returns Объект ошибки
   */
  private createError(
    type: AnonymizeErrorType,
    message: string,
    userMessage: string,
    details?: unknown,
  ): AnonymizeError {
    return {
      type,
      message,
      userMessage,
      details,
    };
  }
}

// Экспортируем единственный экземпляр сервиса
export const anonymizeService = new AnonymizeService();
export const getAnonymizeResults = () => anonymizeService.getAnonymizeResults();
