import { NextResponse } from 'next/server';

import type { AnonymizeResult } from '@/features/anonymize/ui/server/ResultsList';

/**
 * Возвращает историю анонимизации
 */
export function GET() {
  try {
    // В реальном приложении здесь был бы запрос к базе данных
    // Пример: const results = await db.query('SELECT * FROM anonymize_history ORDER BY created_at DESC LIMIT 10');

    // Демо-данные для примера
    const demoResults: AnonymizeResult[] = [
      {
        id: '1',
        originalText: 'Пример текста с именем Иван Петров и email test@example.com',
        anonymizedText: 'Пример текста с именем [ИМЯ] и email [EMAIL]',
        timestamp: new Date().toISOString(),
        metadata: {
          replacedNames: 1,
          replacedEmails: 1,
          replacedPhones: 0,
        },
      },
    ];

    return NextResponse.json({
      success: true,
      results: demoResults,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API Error:', error);
    return NextResponse.json(
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Произошла ошибка при получении истории анонимизации',
      },
      { status: 500 },
    );
  }
}

/**
 * Сохраняет результат анонимизации в историю
 */
export async function POST(request: Request) {
  try {
    const requestData = (await request.json()) as { originalText: string; anonymizedText: string };
    const { originalText, anonymizedText } = requestData;

    if (!originalText || !anonymizedText) {
      return NextResponse.json(
        { success: false, error: 'Необходимые данные отсутствуют' },
        { status: 400 },
      );
    }

    // В реальном приложении здесь был бы запрос к базе данных для сохранения
    // Пример: await db.query('INSERT INTO anonymize_history (original_text, anonymized_text, metadata) VALUES (?, ?, ?)',
    //   [originalText, anonymizedText, JSON.stringify(metadata)]);

    // Демо-ответ
    return NextResponse.json({
      success: true,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API Error:', error);
    return NextResponse.json(
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Произошла ошибка при сохранении результата анонимизации',
      },
      { status: 500 },
    );
  }
}
