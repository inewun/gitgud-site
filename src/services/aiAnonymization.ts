/**
 * Сервис для работы с AI-анонимизацией через Python-сервер
 */

// Типы данных для работы с API анонимизации
export interface AiAnonymizationRequest {
  text: string;
}

export interface EntityResult {
  type: string;
  text: string;
}

export interface ChunkResult {
  original: string;
  corrected: string;
}

export interface AiAnonymizationResponse {
  originalText: string;
  anonymizedText: string;
  entities: EntityResult[];
  chunks: ChunkResult[];
}

export interface AiAnonymizationApiResponse {
  success: boolean;
  result: AiAnonymizationResponse;
  timestamp: string;
  error?: string;
  details?: string;
}

/**
 * Отправляет текст на API-сервер для анонимизации через AI
 *
 * @param text Текст для анонимизации
 * @returns Результат анонимизации
 * @throws Error если запрос завершился с ошибкой
 */
export async function aiAnonymizeText(text: string): Promise<AiAnonymizationResponse> {
  try {
    const response = await fetch('/api/anonymize/ai-anonymize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при анонимизации текста');
    }

    const data = (await response.json()) as AiAnonymizationApiResponse;

    if (!data.success) {
      throw new Error(data.error || 'Неизвестная ошибка при анонимизации');
    }

    return data.result;
  } catch (error) {
    console.error('Ошибка при запросе к API анонимизации:', error);
    throw error;
  }
}

/**
 * Проверяет доступность API-сервера анонимизации
 *
 * @returns true если сервер доступен, false в противном случае
 */
export async function checkAiAnonymizationServerStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/anonymize/ai-anonymize', {
      method: 'GET',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === 'ok' && data.apiReady === true;
  } catch (error) {
    console.error('Ошибка при проверке статуса сервера анонимизации:', error);
    return false;
  }
}
