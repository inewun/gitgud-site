'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AriaLiveType = 'off' | 'polite' | 'assertive';

/**
 * Типы сообщений для AriaAnnouncer
 */
interface AriaMessage {
  /**
   * Уникальный идентификатор сообщения
   */
  id: string;
  /**
   * Текст сообщения
   */
  message?: string;
  /**
   * Уровень важности
   */
  ariaLive: AriaLiveType;
  /**
   * Тип объявляемых изменений
   */
  ariaRelevant: 'all' | 'additions' | 'removals';
  /**
   * Объявлять ли весь контент целиком или только изменения
   */
  ariaAtomic: boolean;
  /**
   * Время в миллисекундах, через которое сообщение будет удалено
   */
  timeout: number;
}

/**
 * Состояние контекста AriaAnnouncer
 */
interface AriaAnnouncerContextType {
  /**
   * Объявить сообщение с обычным приоритетом (polite)
   * @param message - Текст сообщения
   * @param options - Дополнительные опции
   */
  announce: (message: string, options?: Partial<Omit<AriaMessage, 'id' | 'message'>>) => string;
  /**
   * Объявить сообщение с высоким приоритетом (assertive)
   * @param message - Текст сообщения
   * @param options - Дополнительные опции
   */
  announceAssertive: (
    message: string,
    options?: Partial<Omit<AriaMessage, 'id' | 'message'>>,
  ) => string;
  /**
   * Удалить сообщение по ID
   * @param id - ID сообщения для удаления
   */
  removeMessage: (id: string) => void;
}

/**
 * Создаем контекст с начальным состоянием
 */
export const AriaAnnouncerContext = createContext<AriaAnnouncerContextType | null>(null);

/**
 * Хук для доступа к функциям AriaAnnouncer
 * @returns Методы для работы с объявлениями
 */
export function useAriaAnnouncer() {
  const context = useContext(AriaAnnouncerContext);

  if (context === null) {
    throw new Error('useAriaAnnouncer must be used within AriaAnnouncerProvider');
  }

  return context;
}

/**
 * Высокоуровневый компонент для интеграции AriaAnnouncer с компонентами
 * @param Component - Компонент для оборачивания
 * @returns Обернутый компонент с доступом к ariaAnnouncer
 */
export function withAriaAnnouncer<P extends object>(
  Component: React.ComponentType<P & { ariaAnnouncer: AriaAnnouncerContextType }>,
) {
  const displayName = Component.displayName || Component.name || 'Component';

  const ComponentWithAnnouncer = (props: P) => {
    const ariaAnnouncer = useAriaAnnouncer();

    return <Component {...props} ariaAnnouncer={ariaAnnouncer} />;
  };

  ComponentWithAnnouncer.displayName = `withAriaAnnouncer(${displayName})`;

  return ComponentWithAnnouncer;
}

/**
 * Компонент для объявления сообщений для скринридеров
 * Добавляет возможность динамически объявлять важные изменения интерфейса
 */
export function AriaAnnouncer(): React.ReactElement {
  const [messages, setMessages] = useState<AriaMessage[]>([]);

  // Генерирует уникальный ID
  const generateId = useCallback(
    () => `aria-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    [],
  );

  // Добавляет новое сообщение
  const announceMessage = useCallback(
    (
      message: string,
      ariaLive: AriaLiveType = 'polite',
      options?: Partial<Omit<AriaMessage, 'id' | 'message' | 'ariaLive'>>,
    ): string => {
      const id = generateId();
      const newMessage: AriaMessage = {
        id,
        message,
        ariaLive,
        ariaRelevant: 'all',
        ariaAtomic: true,
        timeout: 7000,
        ...options,
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);

      return id;
    },
    [generateId],
  );

  // Объявить сообщение с обычным приоритетом
  const announce = useCallback(
    (message: string, options?: Partial<Omit<AriaMessage, 'id' | 'message'>>) => {
      return announceMessage(message, options?.ariaLive || 'polite', options);
    },
    [announceMessage],
  );

  // Объявить сообщение с высоким приоритетом
  const announceAssertive = useCallback(
    (message: string, options?: Partial<Omit<AriaMessage, 'id' | 'message'>>) => {
      return announceMessage(message, 'assertive', options);
    },
    [announceMessage],
  );

  // Удалить сообщение по ID
  const removeMessage = useCallback((id: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  }, []);

  // Очистка сообщений по таймеру
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    messages.forEach(message => {
      const timer = setTimeout(() => {
        removeMessage(message.id);
      }, message.timeout);

      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => {
        clearTimeout(timer);
      });
    };
  }, [messages, removeMessage]);

  // Группируем сообщения по приоритету
  const politeMessages = messages.filter(msg => msg.ariaLive === 'polite');
  const assertiveMessages = messages.filter(msg => msg.ariaLive === 'assertive');

  // Используем useEffect для установки контекста
  useEffect(() => {
    // Предоставляем API через контекст
    const contextValue: AriaAnnouncerContextType = {
      announce,
      announceAssertive,
      removeMessage,
    };

    // Устанавливаем значение контекста глобально для доступа из всего приложения
    Object.assign(AriaAnnouncerContext, {
      current: contextValue,
      Provider: AriaAnnouncerContext.Provider,
      Consumer: AriaAnnouncerContext.Consumer,
    });
  }, [announce, announceAssertive, removeMessage]);

  return (
    <AriaAnnouncerContext.Provider
      value={{
        announce,
        announceAssertive,
        removeMessage,
      }}
    >
      {/* Регион для объявлений с высоким приоритетом */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="all"
        className="sr-only"
        data-testid="aria-announcer-assertive"
      >
        {assertiveMessages.map(message => (
          <div key={message.id}>{message.message}</div>
        ))}
      </div>

      {/* Регион для объявлений с обычным приоритетом */}
      <div
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="all"
        className="sr-only"
        data-testid="aria-announcer-polite"
      >
        {politeMessages.map(message => (
          <div key={message.id}>{message.message}</div>
        ))}
      </div>
    </AriaAnnouncerContext.Provider>
  );
}
