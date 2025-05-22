/**
 * Типы сообщений для обмена данными с воркером
 */
export enum WorkerMessageType {
  INITIALIZE = 'initialize',
  EXECUTE = 'execute',
  RESPONSE = 'response',
  ERROR = 'error',
  TERMINATE = 'terminate',
  STATUS = 'status',
}

/**
 * Интерфейс запроса к воркеру
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WorkerRequest<T = any> {
  /**
   * Тип сообщения
   */
  type: WorkerMessageType;

  /**
   * Идентификатор операции
   */
  operationId?: string;

  /**
   * Имя функции для выполнения
   */
  functionName?: string;

  /**
   * Параметры для передачи в функцию
   */
  params?: T;

  /**
   * Transferable объекты для оптимизации передачи
   */
  transferables?: Transferable[];
}

/**
 * Интерфейс ответа от воркера
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WorkerResponse<T = any> {
  /**
   * Тип сообщения
   */
  type: WorkerMessageType;

  /**
   * Идентификатор операции
   */
  operationId?: string;

  /**
   * Результат операции
   */
  result?: T;

  /**
   * Сообщение об ошибке
   */
  error?: string;

  /**
   * Стек ошибки для отладки
   */
  errorStack?: string;

  /**
   * Информация о статусе выполнения
   */
  status?: {
    /**
     * Процент выполнения (0-100)
     */
    progress: number;

    /**
     * Текстовое сообщение о текущем статусе
     */
    message: string;
  };
}

/**
 * Тип для функции, регистрируемой в воркере
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkerFunction<TParams = any, TResult = any> = (
  params: TParams,
  postProgress?: (progress: number, message: string) => void,
) => Promise<TResult> | TResult;

/**
 * Фабрика для создания код воркера "на лету"
 *
 * @param workerFunctions Объект с функциями для регистрации в воркере
 * @returns URL для создания воркера
 *
 * @example
 * const workerUrl = createWorkerURL({
 *   processData: (data, progress) => {
 *     // Тяжелые вычисления
 *     return processedData;
 *   }
 * });
 * const worker = new Worker(workerUrl);
 */
export function createWorkerURL(workerFunctions: Record<string, WorkerFunction>): string {
  // Создаем код воркера как строку
  const workerCode = `
    // Регистрация функций
    const workerFunctions = {};
    
    // Обработчик сообщений
    self.onmessage = async function(event) {
      const { type, operationId, functionName, params, transferables } = event.data;
      
      // Функция для отправки обновлений статуса прогресса
      const postProgress = (progress, message) => {
        self.postMessage({
          type: '${WorkerMessageType.STATUS}',
          operationId,
          status: { progress, message }
        });
      };
      
      try {
        switch (type) {
          case '${WorkerMessageType.INITIALIZE}':
            // Отправляем подтверждение инициализации
            self.postMessage({
              type: '${WorkerMessageType.RESPONSE}',
              result: { initialized: true }
            });
            break;
            
          case '${WorkerMessageType.EXECUTE}':
            if (!functionName || !workerFunctions[functionName]) {
              throw new Error(\`Function "\${functionName}" not found\`);
            }
            
            // Выполняем функцию
            const result = await workerFunctions[functionName](params, postProgress);
            
            // Отправляем результат
            self.postMessage({
              type: '${WorkerMessageType.RESPONSE}',
              operationId,
              result
            }, transferables || []);
            break;
            
          case '${WorkerMessageType.TERMINATE}':
            // Завершаем воркер
            self.close();
            break;
            
          default:
            throw new Error(\`Unknown message type: \${type}\`);
        }
      } catch (error) {
        // Отправляем ошибку
        self.postMessage({
          type: '${WorkerMessageType.ERROR}',
          operationId,
          error: error.message,
          errorStack: error.stack
        });
      }
    };
    
    // Функции регистрации
    function registerFunction(name, fn) {
      workerFunctions[name] = fn;
    }
    
    // Регистрируем все переданные функции
    ${Object.entries(workerFunctions)
      .map(([name, fn]) => `registerFunction('${name}', ${fn.toString()});`)
      .join('\n')}
  `;

  // Создаем Blob и URL для воркера
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
}

/**
 * Класс для управления Web Worker и выполнения задач в отдельном потоке
 *
 * @example
 * const worker = new WorkerManager({
 *   processText: (text, progress) => {
 *     // Симуляция долгой обработки
 *     for (let i = 0; i < 100; i++) {
 *       // Тяжелые вычисления
 *       progress(i, `Обработка шага ${i}`);
 *     }
 *     return `Обработанный текст: ${text}`;
 *   }
 * });
 *
 * // Использование
 * try {
 *   const result = await worker.execute('processText', 'Привет, мир!', {
 *     onProgress: (progress, message) => {
// eslint-disable-next-line no-console
 *       console.log(`Прогресс: ${progress}%, ${message}`);
 *     }
 *   });
// eslint-disable-next-line no-console
 *   console.log(result); // "Обработанный текст: Привет, мир!"
 * } catch (error) {
// eslint-disable-next-line no-console
 *   console.error('Ошибка:', error);
 * } finally {
 *   // Завершаем воркер, когда он больше не нужен
 *   worker.terminate();
 * }
 */
export class WorkerManager {
  /**
   * Web Worker экземпляр
   */
  private worker: Worker;

  /**
   * URL-адрес воркера для освобождения ресурсов
   */
  private workerURL: string;

  /**
   * Ожидающие операции
   */
  private operations: Map<
    string,
    {
      // Явно типизируем resolve с помощью дженериков
      resolve: <T = unknown>(value: T) => void;
      reject: (reason: unknown) => void;
      onProgress?: (progress: number, message: string) => void;
    }
  > = new Map();

  /**
   * Флаг инициализации воркера
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  private initialized: boolean = false;

  /**
   * Создает новый экземпляр менеджера воркеров
   *
   * @param functions Объект с функциями для регистрации в воркере
   */
  constructor(functions: Record<string, WorkerFunction>) {
    // Создаем воркер с функциями
    this.workerURL = createWorkerURL(functions);
    this.worker = new Worker(this.workerURL);

    // Настраиваем обработчик сообщений
    this.worker.onmessage = this.handleMessage.bind(this);

    // Инициализируем воркер
    void this.initialize();
  }

  /**
   * Инициализирует воркер и подготавливает его к работе
   */
  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      // Создаем уникальный идентификатор операции
      const operationId = `init_${Date.now()}`;

      // Регистрируем операцию инициализации
      this.operations.set(operationId, {
        resolve: () => {
          this.initialized = true;
          resolve();
        },
        reject,
      });

      // Отправляем сообщение инициализации
      this.worker.postMessage({
        type: WorkerMessageType.INITIALIZE,
        operationId,
      });
    });
  }

  /**
   * Обработчик сообщений от воркера
   *
   * @param event Событие сообщения
   */
  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const data = event.data;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { type, operationId, result, error, errorStack, status } = data;

    // Обрабатываем тип сообщения
    switch (type) {
      case WorkerMessageType.RESPONSE:
        // Успешное выполнение запроса
        if (operationId && this.operations.has(operationId)) {
          const operation = this.operations.get(operationId);
          if (operation) {
            const { resolve } = operation;
            // Удаляем операцию из списка ожидания
            this.operations.delete(operationId);
            // Возвращаем результат
            resolve(result);
          }
        }
        break;

      case WorkerMessageType.ERROR:
        // Ошибка выполнения
        if (operationId && this.operations.has(operationId)) {
          const operation = this.operations.get(operationId);
          if (operation) {
            const { reject } = operation;
            // Удаляем операцию из списка ожидания
            this.operations.delete(operationId);
            // Создаем объект ошибки с сохранением стека
            const workerError = new Error(error);
            if (errorStack) {
              workerError.stack = errorStack;
            }
            // Отклоняем промис с ошибкой
            reject(workerError);
          }
        }
        break;

      case WorkerMessageType.STATUS:
        // Обновление статуса выполнения
        if (operationId && this.operations.has(operationId) && status) {
          const operation = this.operations.get(operationId);
          if (operation) {
            const { onProgress } = operation;
            // Уведомляем о прогрессе, если есть колбэк
            onProgress?.(status.progress, status.message);
          }
        }
        break;

      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown message type: ${type}`);
    }
  }

  /**
   * Выполняет функцию в воркере
   *
   * @param functionName Имя функции для выполнения
   * @param params Параметры для передачи в функцию
   * @param options Дополнительные опции
   * @returns Промис с результатом выполнения
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execute<TParams = any, TResult = any>(
    functionName: string,
    params: TParams,
    options: {
      /**
       * Передаваемые объекты для оптимизации обмена данными
       */
      transferables?: Transferable[];

      /**
       * Колбэк для отслеживания прогресса выполнения
       */
      onProgress?: (progress: number, message: string) => void;
    } = {},
  ): Promise<TResult> {
    // Ждем завершения инициализации, если она еще не выполнена
    if (!this.initialized) {
      await this.initialize();
    }

    return new Promise<TResult>((resolve, reject) => {
      const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.operations.set(operationId, {
        resolve: resolve as <T = unknown>(value: T) => void,
        reject,
        onProgress: options.onProgress,
      });

      this.worker.postMessage(
        {
          type: WorkerMessageType.EXECUTE,
          operationId,
          functionName,
          params,
          transferables: options.transferables,
        },
        options.transferables || [],
      );
    });
  }

  /**
   * Завершает работу воркера и освобождает ресурсы
   */
  terminate(): void {
    // Удаляем проверку на this.worker, так как она всегда истинна
    try {
      // Отправляем сообщение о завершении
      this.worker.postMessage({
        type: WorkerMessageType.TERMINATE,
      });

      // Отклоняем все ожидающие операции
      this.operations.forEach(operation => {
        operation.reject(new Error('Воркер был принудительно завершен'));
      });
      this.operations.clear();

      // Закрываем воркер
      this.worker.terminate();

      // Освобождаем URL
      URL.revokeObjectURL(this.workerURL);

      // Удаляем ссылки
      this.worker = null as unknown as Worker;
      this.workerURL = '';
      this.initialized = false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при завершении воркера:', error);
    }
  }
}

/**
 * Функция для создания однократно используемого воркера для выполнения отдельной задачи
 *
 * @param fn Функция для выполнения в воркере
 * @param params Параметры для передачи в функцию
 * @param options Дополнительные опции
 * @returns Промис с результатом выполнения
 *
 * @example
 * const result = await runInWorker(
 *   data => {
 *     // Тяжелые вычисления
 *     return processedData;
 *   },
 *   { text: "Hello world" }
 * );
 */
export async function runInWorker<TParams = unknown, TResult = unknown>(
  fn: WorkerFunction<TParams, TResult>,
  params: TParams,
  options: {
    transferables?: Transferable[];
    onProgress?: (progress: number, message: string) => void;
  } = {},
): Promise<TResult> {
  // Создаем уникальное имя функции
  const functionName = `fn_${Date.now()}`;

  // Создаем временный воркер
  const workerManager = new WorkerManager({
    [functionName]: fn,
  });

  try {
    // Выполняем функцию
    return await workerManager.execute<TParams, TResult>(functionName, params, options);
  } finally {
    // Завершаем воркер в любом случае
    workerManager.terminate();
  }
}

/**
 * Пример функции анонимизации текста, которая выполняется в отдельном потоке
 *
 * @param options Опции для анонимизации
 * @param postProgress Функция для отправки обновлений прогресса
 * @returns Анонимизированный текст
 *
 * @example
 * const worker = new WorkerManager({
 *   anonymizeText: anonymizeTextInWorker
 * });
 *
 * const result = await worker.execute('anonymizeText', {
 *   text: "Иванов Иван Иванович 12345",
 *   patterns: ["names", "numbers"]
 * });
 */
export function anonymizeTextInWorker(
  options: {
    text: string;
    patterns: string[];
    replacements?: Record<string, string>;
  },
  postProgress?: (progress: number, message: string) => void,
): string {
  const { text, patterns } = options;

  // Если нет текста или паттернов, возвращаем исходный текст
  if (!text || !patterns.length) {
    return text;
  }

  // Сообщаем о начале работы
  postProgress?.(0, 'Начало анонимизации текста');

  // Здесь будет код анонимизации
  const anonymizedText = text;

  // Сообщаем о завершении
  postProgress?.(100, 'Анонимизация завершена');

  return anonymizedText;
}
