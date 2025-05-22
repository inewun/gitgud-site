'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { type UseAnonymizeOptions } from '@/domain/anonymize';

// Схема валидации входных данных
const anonymizeInputSchema = z.object({
  text: z.string().min(1, 'Текст не может быть пустым'),
  options: z
    .object({
      replaceNames: z.boolean().default(true),
      replaceEmails: z.boolean().default(true),
      replacePhones: z.boolean().default(true),
      replaceDates: z.boolean().default(false),
      replaceAddresses: z.boolean().default(false),
      replaceIPs: z.boolean().default(false),
    })
    .optional(),
});

// Тип результата анонимизации
export type AnonymizeActionResult = {
  success: boolean;
  data?: {
    anonymizedText: string;
    metadata?: {
      replacedNames?: number;
      replacedEmails?: number;
      replacedPhones?: number;
      replacedDates?: number;
      replacedAddresses?: number;
      replacedIPs?: number;
    };
  };
  error?: {
    message: string;
    code?: string;
  };
};

/**
 * Серверное действие для анонимизации текста
 */
export async function anonymizeText(formData: FormData): Promise<AnonymizeActionResult> {
  try {
    // В Next.js 13+ проверка CSRF токена обычно выполняется автоматически для Server Actions,
    // поэтому ручная проверка может быть избыточной.
    // В middleware.ts уже настроена CSRF защита

    // Преобразуем FormData в объект
    const rawInput = {
      text: formData.get('inputText') as string,
      options: {
        replaceNames: formData.get('replaceNames') === 'on',
        replaceEmails: formData.get('replaceEmails') === 'on',
        replacePhones: formData.get('replacePhones') === 'on',
        replaceDates: formData.get('replaceDates') === 'on',
        replaceAddresses: formData.get('replaceAddresses') === 'on',
        replaceIPs: formData.get('replaceIPs') === 'on',
      },
    };

    // Валидируем входные данные
    const validationResult = anonymizeInputSchema.safeParse(rawInput);

    if (!validationResult.success) {
      return {
        success: false,
        error: {
          message: 'Ошибка валидации данных',
          code: 'validation_error',
        },
      };
    }

    const { text, options } = validationResult.data;

    // Здесь должна быть логика для анонимизации
    // В реальном приложении здесь был бы вызов API или библиотеки

    // Имитация анонимизации
    // (в реальном приложении здесь была бы настоящая логика)
    const anonymizedText = await mockAnonymizeText(text, options);

    // Обновляем кеш для маршрута
    revalidatePath('/anonymize');

    return {
      success: true,
      data: {
        anonymizedText,
        metadata: {
          replacedNames: 3,
          replacedEmails: 2,
          replacedPhones: 1,
        },
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при анонимизации:', error);

    return {
      success: false,
      error: {
        message: 'Внутренняя ошибка сервера',
        code: 'server_error',
      },
    };
  }
}

/**
 * Простая имитация анонимизации для примера
 * (в реальном проекте здесь была бы настоящая реализация)
 */
async function mockAnonymizeText(text: string, options?: UseAnonymizeOptions): Promise<string> {
  // Добавляем искусственную задержку для симуляции обработки
  await new Promise(resolve => setTimeout(resolve, 300));

  let result = text;

  if (options?.replaceNames) {
    result = result.replace(/\b[А-Я][а-я]+ [А-Я][а-я]+\b/g, '[ИМЯ]');
  }

  if (options?.replaceEmails) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result = result.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL]');
  }

  if (options?.replacePhones) {
    result = result.replace(
      /\+?[0-9]{1,3}[- (]?[0-9]{3}[- )]?[0-9]{3}[- ]?[0-9]{2}[- ]?[0-9]{2}\b/g,
      '[ТЕЛЕФОН]',
    );
  }

  if (options?.replaceDates) {
    result = result.replace(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g, '[ДАТА]');
  }

  if (options?.replaceAddresses) {
    result = result.replace(/\b[А-Я][а-я]+ (ул|пр|пер|б-р)[.,] [^\n,]+\b/gi, '[АДРЕС]');
  }

  if (options?.replaceIPs) {
    result = result.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP-АДРЕС]');
  }

  return result;
}
