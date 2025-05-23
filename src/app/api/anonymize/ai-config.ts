/**
 * Конфигурация для подключения к серверу AI-анонимизации
 */

// URL API-сервера анонимизации (по умолчанию локальный)
export const ANONYMIZATION_API_URL = 
  process.env.ANONYMIZATION_API_URL || 'http://194.87.29.151:5000';

// API ключ для аутентификации на сервере (должен совпадать с ключом на сервере)
export const ANONYMIZATION_API_KEY = 
  process.env.ANONYMIZATION_API_KEY || 'your_secret_api_key';

// Настройки для запросов к API серверу
export const AI_ANONYMIZATION_CONFIG = {
  baseUrl: ANONYMIZATION_API_URL,
  apiKey: ANONYMIZATION_API_KEY,
  endpoints: {
    analyze: '/analyze',
    health: '/health',
  },
  options: {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': ANONYMIZATION_API_KEY,
    },
  },
}; 
