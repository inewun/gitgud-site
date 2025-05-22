import { NextRequest, NextResponse } from 'next/server';

// Интерфейс для метрик Web Vitals
interface WebVitalMetrics {
  id: string;
  name: string;
  value: number;
  rating: string;
  delta: number;
  page: string;
}

/**
 * API эндпоинт для сбора метрик Web Vitals
 * Сохраняет метрики и отправляет их в систему аналитики
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем данные метрик
    const metrics = (await request.json()) as WebVitalMetrics;

    // Выводим логи в консоль в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[API] Web Vitals metrics received:', metrics);
    }

    // В реальном приложении здесь можно сделать:
    // 1. Сохранение в базу данных
    // 2. Отправка в систему аналитики (Google Analytics, Amplitude и т.д.)
    // 3. Собственный мониторинг производительности

    // Пример сохранения на сервер
    /*
    await db.insert('web_vitals', {
      id: metrics.id,
      name: metrics.name,
      value: metrics.value,
      rating: metrics.rating,
      delta: metrics.delta,
      page: metrics.page,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('x-forwarded-for') || request.ip || '',
    });
    */

    // Возвращаем успешный ответ
    return NextResponse.json(
      { success: true, message: 'Web Vitals metrics received' },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[API] Error processing Web Vitals metrics:', error);

    // Возвращаем ошибку в случае проблем
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      { success: false, message: 'Error processing metrics' },
      { status: 500 },
    );
  }
}
