import { z } from 'zod';

import { sanitizeInput } from '@/shared/lib/sanitize';

/**
 * Базовая схема для текстовых полей с санитизацией
 */
export const sanitizedStringSchema = z
  .string()
  .min(1, 'Поле не может быть пустым')
  .transform(val => sanitizeInput(val));

/**
 * Схема для валидации формы анонимизации
 */
export const anonymizeFormSchema = z.object({
  inputText: z
    .string()
    .min(5, 'Текст должен содержать минимум 5 символов')
    .max(10000, 'Текст не должен превышать 10000 символов')
    .refine(
      (text: string) => !/^\s+$/.test(text),
      'Текст не может состоять только из пробельных символов',
    )
    .transform(val => sanitizeInput(val)),
});

/**
 * Тип данных формы анонимизации
 */
export type AnonymizeFormData = z.infer<typeof anonymizeFormSchema>;

/**
 * Схема для опций анонимизации
 */
export const anonymizeOptionsSchema = z.object({
  replaceNames: z.boolean().default(true),
  replaceEmails: z.boolean().default(true),
  replacePhones: z.boolean().default(true),
  replaceDates: z.boolean().default(false),
  replaceAddresses: z.boolean().default(false),
  replaceIPs: z.boolean().default(false),
});

/**
 * Тип данных опций анонимизации
 */
export type AnonymizeOptionsData = z.infer<typeof anonymizeOptionsSchema>;

/**
 * Схема для результата анонимизации
 */
export const anonymizeResultSchema = z.object({
  id: z.string().uuid().optional(),
  originalText: z.string().min(1, 'Текст не может быть пустым').transform(sanitizeInput),
  anonymizedText: z.string().min(1, 'Текст не может быть пустым').transform(sanitizeInput),
  timestamp: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.number()).optional(),
});

/**
 * Тип данных результата анонимизации
 */
export type AnonymizeResultData = z.infer<typeof anonymizeResultSchema>;

/**
 * Схема для запроса API сохранения результата анонимизации
 */
export const saveAnonymizeRequestSchema = z.object({
  originalText: z
    .string()
    .min(1, 'Текст не может быть пустым')
    .max(50000, 'Исходный текст слишком длинный')
    .transform(sanitizeInput),
  anonymizedText: z
    .string()
    .min(1, 'Текст не может быть пустым')
    .max(50000, 'Анонимизированный текст слишком длинный')
    .transform(sanitizeInput),
  metadata: z.record(z.string(), z.number()).optional(),
});

/**
 * Тип данных запроса API сохранения результата
 */
export type SaveAnonymizeRequestData = z.infer<typeof saveAnonymizeRequestSchema>;

/**
 * Схема для ответа API сохранения результата анонимизации
 */
export const saveAnonymizeResponseSchema = z.object({
  success: z.boolean(),
  id: z.string().uuid().optional(),
  timestamp: z.string().datetime().optional(),
  error: z.string().optional(),
});

/**
 * Тип данных ответа API сохранения результата
 */
export type SaveAnonymizeResponseData = z.infer<typeof saveAnonymizeResponseSchema>;

/**
 * Схема для ответа API получения истории анонимизации
 */
export const getAnonymizeHistoryResponseSchema = z.object({
  success: z.boolean(),
  results: z.array(anonymizeResultSchema).optional(),
  error: z.string().optional(),
});

/**
 * Тип данных ответа API получения истории
 */
export type GetAnonymizeHistoryResponseData = z.infer<typeof getAnonymizeHistoryResponseSchema>;
