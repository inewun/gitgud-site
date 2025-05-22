/**
 * Утилита для проверки наличия необходимых переменных окружения
 */

/**
 * Обязательные переменные окружения для работы приложения
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_DESCRIPTION',
  'NODE_ENV',
];

/**
 * Проверяет наличие необходимых переменных окружения
 * @throws {Error} Если отсутствуют обязательные переменные
 */
export function checkRequiredEnvVars(): void {
  // Игнорируем проверку в режиме разработки, чтобы не блокировать локальную разработку
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Отсутствуют необходимые переменные окружения: ${missingVars.join(', ')}`);
  }
}

/**
 * Дополнительные переменные, отсутствие которых может повлиять на функциональность,
 * но не является критичным для запуска приложения
 */
export function checkOptionalEnvVars(): string[] {
  const OPTIONAL_ENV_VARS = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GA_TRACKING_ID',
    'NEXT_PUBLIC_FEATURE_ADVANCED_ANONYMIZE',
    'NEXT_PUBLIC_FEATURE_EXPORT_PDF',
    'NEXT_PUBLIC_CSP_CONNECT_SRC',
    'NEXT_PUBLIC_CSP_SCRIPT_SRC',
  ];

  return OPTIONAL_ENV_VARS.filter(varName => !process.env[varName]);
}

/**
 * Выполняет полную проверку переменных окружения
 * @returns {Object} Объект с результатами проверки
 */
export function validateEnvironment(): {
  isValid: boolean;
  missingRequired: string[];
  missingOptional: string[];
} {
  let missingRequired: string[] = [];

  try {
    checkRequiredEnvVars();
  } catch (error) {
    if (error instanceof Error) {
      missingRequired = error.message
        .replace('Отсутствуют необходимые переменные окружения: ', '')
        .split(', ');
    }
  }

  const missingOptional = checkOptionalEnvVars();

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    missingOptional,
  };
}

export default validateEnvironment;
