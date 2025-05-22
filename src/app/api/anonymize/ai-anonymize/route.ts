import { NextRequest, NextResponse } from 'next/server';
import { AI_ANONYMIZATION_CONFIG } from '../ai-config';

/**
 * API-маршрут для взаимодействия с Python сервером анонимизации
 * Получает текст от фронтенда и отправляет его на Python API сервер
 */
export async function POST(request: NextRequest) {
  try {
    const requestData = (await request.json()) as { text: string };
    const { text } = requestData;

    // Проверка входных данных
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Текст отсутствует или имеет неверный формат' },
        { status: 400 },
      );
    }

    // Отправляем запрос к Python API серверу
    const response = await fetch(`${AI_ANONYMIZATION_CONFIG.baseUrl}${AI_ANONYMIZATION_CONFIG.endpoints.analyze}`, {
      method: 'POST',
      headers: AI_ANONYMIZATION_CONFIG.options.headers,
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: 'Ошибка при обработке на сервере анонимизации', 
          details: errorData.error || 'Неизвестная ошибка'
        },
        { status: response.status },
      );
    }

    // Получаем результат анонимизации
    const result = await response.json();

    // Форматируем ответ для клиента
    return NextResponse.json({
      success: true,
      result: {
        originalText: result.original_text,
        anonymizedText: result.corrected_text,
        entities: result.entities,
        chunks: result.chunks,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
  try {
    // Проверяем доступность Python API сервера
    const response = await fetch(`${AI_ANONYMIZATION_CONFIG.baseUrl}${AI_ANONYMIZATION_CONFIG.endpoints.health}`, {
      headers: AI_ANONYMIZATION_CONFIG.options.headers,
    });

    if (!response.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Сервер анонимизации недоступен',
        time: new Date().toISOString(),
      }, { status: 503 });
    }

    const healthData = await response.json();

    return NextResponse.json({
      status: 'ok',
      apiReady: true,
      serverInfo: healthData,
      time: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Сервер анонимизации недоступен',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      time: new Date().toISOString(),
    }, { status: 503 });
  }
} 