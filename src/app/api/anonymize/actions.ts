'use server';

import { cookies } from 'next/headers';

import type { TextProcessingSettings, UseAnonymizeOptions } from '@/domain/anonymize';
import { apiFacade } from '@/services/api.facade';

// Проверка CSRF токена в Server Action
async function validateCSRFToken(formData: FormData): Promise<boolean> {
  const cookieStore = cookies();
  const csrfCookie = cookieStore.get('csrf_token')?.value;
  const csrfToken = formData.get('csrf_token') as string;

  if (!csrfCookie || !csrfToken) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return false;
  }

  // Добавляем асинхронную операцию для соответствия async сигнатуре
  await Promise.resolve();

  return csrfCookie === csrfToken;
}

/**
 * Server Action для анонимизации текста
 * Использует серверный рендеринг для улучшения производительности
 * и уменьшения нагрузки на клиента
 *
 * @param formData - Данные формы с CSRF токеном
 * @returns Результат анонимизации
 */
export async function anonymizeTextServerAction(formData: FormData): Promise<{
  result: string;
  success: boolean;
  error?: string;
}> {
  // Проверяем CSRF токен
  if (!(await validateCSRFToken(formData))) {
    return {
      result: '',
      success: false,
      error: 'CSRF валидация не пройдена',
    };
  }

  const text = formData.get('text') as string;
  const replaceNames = formData.get('anonymizeNames') === 'true';
  const replaceEmails = formData.get('anonymizeEmails') === 'true';
  const replacePhones = formData.get('anonymizePhones') === 'true';

  if (!text) {
    return {
      result: '',
      success: true,
    };
  }

  const options: Partial<UseAnonymizeOptions> = {
    replaceNames,
    replaceEmails,
    replacePhones,
  };

  try {
    // Используем фасад для анонимизации
    const anonymizedText = apiFacade.anonymizeText(text, options);

    return {
      result: anonymizedText,
      success: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server Action Error:', error);
    return {
      result: '',
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      success: false,
      error: error instanceof Error ? error.message : 'Произошла ошибка при анонимизации текста',
    };
  }
}

/**
 * Server Action для получения настроек приложения
 * @returns Настройки приложения
 */
export async function getAppSettings(formData: FormData): Promise<{
  settings: TextProcessingSettings;
  success: boolean;
  error?: string;
}> {
  // Проверяем CSRF токен
  if (!(await validateCSRFToken(formData))) {
    return {
      settings: {},
      success: false,
      error: 'CSRF валидация не пройдена',
    };
  }

  try {
    const settings = await apiFacade.getAppSettings();

    return {
      settings,
      success: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server Action Error:', error);
    return {
      settings: {},
      success: false,
      error: error instanceof Error ? error.message : 'Произошла ошибка при получении настроек',
    };
  }
}
