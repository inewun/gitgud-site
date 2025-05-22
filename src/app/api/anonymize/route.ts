import { NextRequest, NextResponse } from 'next/server';

import { anonymizeText } from '@/domain/anonymize/model';
import type { UseAnonymizeOptions } from '@/domain/anonymize/types';

/**
 * API обработчик для анонимизации текста в формате App Router
 */
export async function POST(request: NextRequest) {
  try {
    const requestData = (await request.json()) as { text: string; options?: UseAnonymizeOptions };
    const { text, options } = requestData;

    // Проверка входных данных
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Текст отсутствует или имеет неверный формат' },
        { status: 400 },
      );
    }

    const anonymizeOptions: UseAnonymizeOptions = options || {
      replaceNames: true,
      replaceEmails: true,
      replacePhones: true,
      replaceDates: false,
      replaceAddresses: false,
      replaceIPs: false,
    };

    // Анонимизируем текст
    const anonymizedText = anonymizeText(text, anonymizeOptions);

    // Формирование структуры ответа
    const response = {
      success: true,
      result: anonymizedText,
      originalLength: text.length,
      processedLength: anonymizedText.length,
      metadata: {
        options: anonymizeOptions,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при обработке запроса:', error);

    return NextResponse.json(
      {
        error: 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 },
    );
  }
}

// GET для проверки доступности API
export async function GET() {
  // Добавляем await для исправления ошибки @typescript-eslint/require-await
  const version = await Promise.resolve(process.env.NEXT_PUBLIC_VERSION || '1.0.0');

  return NextResponse.json({
    status: 'ok',
    version,
    apiReady: true,
    time: new Date().toISOString(),
  });
}
