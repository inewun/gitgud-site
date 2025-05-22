import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { anonymizeTextInWorker } from '@/shared/lib/workers/worker-factory';

import { router, publicProcedure, protectedProcedure } from '../trpc';

/**
 * Схема для параметров анонимизации с валидацией
 */
const anonymizeParamsSchema = z.object({
  /**
   * Исходный текст для анонимизации
   */
  text: z.string().min(1, 'Текст не может быть пустым'),

  /**
   * Паттерны для анонимизации
   */
  patterns: z.array(z.string()).min(1, 'Выберите хотя бы один паттерн для анонимизации'),

  /**
   * Пользовательские замены (опционально)
   */
  replacements: z.record(z.string(), z.string()).optional(),

  /**
   * Сохранять историю анонимизации (только для авторизованных пользователей)
   */
  saveHistory: z.boolean().optional().default(false),
});

/**
 * Схема для детальных параметров анонимизации с использованием дискриминируемых объединений
 */
const anonymizeConfigSchema = z.discriminatedUnion('mode', [
  // Базовый режим анонимизации
  z.object({
    mode: z.literal('basic'),
    patterns: z.array(z.string()),
  }),

  // Расширенный режим анонимизации с дополнительными параметрами
  z.object({
    mode: z.literal('advanced'),
    patterns: z.array(z.string()),
    customRegex: z.array(z.string()).optional(),
    preserveStructure: z.boolean().optional(),
    replaceType: z.enum(['mask', 'randomize', 'pseudonymize']).optional(),
    contextAware: z.boolean().optional(),
  }),

  // Режим анонимизации с использованием ИИ
  z.object({
    mode: z.literal('ai'),
    sensitivity: z.enum(['low', 'medium', 'high']),
    entityTypes: z.array(z.string()),
    customEntities: z
      .array(
        z.object({
          name: z.string(),
          examples: z.array(z.string()),
        }),
      )
      .optional(),
  }),
]);

/**
 * Маршрутизатор с процедурами для анонимизации текста
 */
export const anonymizeRouter = router({
  /**
   * Процедура для анонимизации текста (доступна всем)
   * Использует веб-воркер для обработки в отдельном потоке
   */
  anonymizeText: publicProcedure.input(anonymizeParamsSchema).mutation(async ({ input }) => {
    const { text, patterns, replacements } = input;

    try {
      // Выполняем анонимизацию текста в отдельном потоке через веб-воркер
      const anonymizedText = await Promise.resolve(
        anonymizeTextInWorker(
          {
            text,
            patterns,
            replacements,
          },
          // Прогресс не отслеживается, т.к. это серверная операция
          undefined,
        ),
      );

      return {
        anonymizedText,
        originalLength: text.length,
        anonymizedLength: anonymizedText.length,
        patternsApplied: patterns,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ошибка при анонимизации текста',
        cause: error,
      });
    }
  }),

  /**
   * Расширенная процедура для анонимизации с сохранением истории
   * (только для авторизованных пользователей)
   */
  anonymizeWithHistory: protectedProcedure
    .input(
      anonymizeParamsSchema.extend({
        saveHistory: z.boolean().default(true),
        title: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { text, patterns, replacements, saveHistory, title } = input;
      // const { user } = ctx;

      try {
        // Выполняем анонимизацию текста
        const anonymizedText = anonymizeTextInWorker(
          {
            text,
            patterns,
            replacements,
          },
          undefined,
        );

        // Записываем информацию в историю пользователя (пример)
        if (saveHistory) {
          // В реальном приложении здесь был бы вызов к базе данных
          // Для продакшн версии лучше использовать специализированный логгер
          const historyData = {
            title: title || 'Анонимизация текста',
            patterns,
            timestamp: new Date().toISOString(),
          };

          // Только для отладки, не выполняется в production
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.debug('Сохранение истории анонимизации:', historyData);
          }
        }

        return {
          anonymizedText,
          originalLength: text.length,
          anonymizedLength: anonymizedText.length,
          patternsApplied: patterns,
          timestamp: new Date().toISOString(),
          historyId: saveHistory ? `history_${Date.now()}` : undefined,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Ошибка при анонимизации текста',
          cause: error,
        });
      }
    }),

  /**
   * Процедура для получения доступных паттернов анонимизации
   */
  getPatterns: publicProcedure.query(() => {
    return [
      {
        id: 'names',
        name: 'ФИО',
        description: 'Анонимизация полных имен (Фамилия Имя Отчество)',
      },
      {
        id: 'emails',
        name: 'Email-адреса',
        description: 'Анонимизация email-адресов',
      },
      {
        id: 'phones',
        name: 'Телефонные номера',
        description: 'Анонимизация телефонных номеров в различных форматах',
      },
      {
        id: 'numbers',
        name: 'Числовые данные',
        description: 'Анонимизация числовых последовательностей (коды, номера счетов и т.д.)',
      },
      {
        id: 'addresses',
        name: 'Адреса',
        description: 'Анонимизация физических адресов',
      },
      {
        id: 'dates',
        name: 'Даты',
        description: 'Анонимизация дат в различных форматах',
      },
      {
        id: 'passports',
        name: 'Паспортные данные',
        description: 'Анонимизация паспортных данных и других документов',
      },
      {
        id: 'custom',
        name: 'Пользовательский паттерн',
        description: 'Пользовательские регулярные выражения',
      },
    ];
  }),

  /**
   * Процедура для получения истории анонимизации пользователя
   * (только для авторизованных)
   */
  getUserHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      const { limit /* cursor */ } = input;
      // const { user } = ctx;

      // В реальном приложении здесь был бы запрос к базе данных
      // Пример имитации данных
      const items = Array.from({ length: limit }).map((_, i) => ({
        id: `history_${Date.now() - i * 86400000}`,
        title: `Анонимизация текста ${i + 1}`,
        patterns: ['names', 'emails'],
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        textLength: 1000 + i * 100,
      }));

      return {
        items,
        nextCursor: items.length === limit ? `cursor_${Date.now()}` : undefined,
      };
    }),

  /**
   * Расширенная процедура анонимизации с использованием дискриминируемых объединений
   */
  anonymizeWithConfig: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        config: anonymizeConfigSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { text, config } = input;

      // Преобразуем конфигурацию в набор паттернов
      let patterns: string[] = [];

      switch (config.mode) {
        case 'basic':
          patterns = config.patterns;
          break;

        case 'advanced':
          patterns = [
            ...config.patterns,
            ...(config.customRegex?.map(regex => `regex:${regex}`) || []),
          ];
          break;

        case 'ai':
          // В реальном приложении здесь была бы логика для ИИ-анонимизации
          patterns = config.entityTypes.map(type => `ai:${type}`);
          break;
      }

      try {
        // Добавляем await для исправления ошибки require-await
        const anonymizedText = await Promise.resolve(
          anonymizeTextInWorker(
            {
              text,
              patterns,
            },
            undefined,
          ),
        );

        return {
          anonymizedText,
          mode: config.mode,
          originalLength: text.length,
          anonymizedLength: anonymizedText.length,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Ошибка при анонимизации текста',
          cause: error,
        });
      }
    }),
});
