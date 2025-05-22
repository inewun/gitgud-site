import React from 'react';

/**
 * Тип для определения серверных пропсов
 */
export interface ServerComponentProps {
  /**
   * Содержимое компонента
   */
  children?: React.ReactNode;

  /**
   * Дополнительный CSS-класс
   */
  className?: string;

  /**
   * Уникальный идентификатор компонента
   */
  id?: string;

  /**
   * Данные для рендеринга на сервере
   */
  serverData?: Record<string, unknown>;

  /**
   * Функция-обработчик серверных ошибок
   */
  onServerError?: (error: Error) => void;
}

/**
 * Серверный компонент для рендеринга только на сервере
 * Нет эквивалента для клиентского рендеринга
 */
export function ServerComponent({
  children,
  className = '',
  id,
  serverData,
}: ServerComponentProps) {
  return (
    <div
      id={id}
      className={`server-component ${className}`}
      data-server-only="true"
      data-server-rendered="true"
    >
      {children}
      {serverData && (
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serverData).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </div>
  );
}

/**
 * Тип для React-компонента серверного рендеринга
 */
export type ServerRenderComponent<T = unknown> = React.FC<{
  /**
   * Данные для серверного рендеринга
   */
  data: T;

  /**
   * Идентификатор для связи с клиентским компонентом
   */
  hydrationId: string;

  /**
   * Флаг, указывающий на необходимость интерактивности
   */
  hydrate?: boolean;
}>;

/**
 * Функция для создания компонентов, которые рендерятся на сервере,
 * но могут быть гидратированы на клиенте
 *
 * @example
 * // Создание серверного компонента с возможностью гидратации
 * const UserProfile = createServerComponent<UserData>(
 *   (props) => <div>{props.data.name}</div>,
 *   {
 *     clientEquivalent: ClientUserProfile,
 *     clientImport: () => import('./ClientUserProfile')
 *   }
 * );
 */
export function createServerComponent<T>(
  ServerComponent: React.FC<{ data: T; hydrationId: string }>,
  options?: {
    /**
     * Клиентский компонент для гидратации
     */
    clientEquivalent?: React.FC<{ data: T; hydrationId: string }>;

    /**
     * Функция для динамического импорта клиентского компонента
     */
    clientImport?: () => Promise<{ default: React.FC<{ data: T; hydrationId: string }> }>;

    /**
     * Флаг, указывающий гидратировать ли компонент по умолчанию
     */
    hydrate?: boolean;
  },
): ServerRenderComponent<T> {
  return function WrappedServerComponent({ data, hydrationId, hydrate }) {
    // Информация для потенциальной гидратации
    const hydrationInfo = {
      hydrate: hydrate ?? options?.hydrate ?? false,
      clientModule: options?.clientImport ? String(options.clientImport) : undefined,
      hasClientEquivalent: !!options?.clientEquivalent,
    };

    return (
      <div
        data-hydration-id={hydrationId}
        data-server-rendered="true"
        data-hydration-enabled={hydrationInfo.hydrate}
      >
        <ServerComponent data={data} hydrationId={hydrationId} />
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              id: hydrationId,
              data,
              hydrationInfo,
            }).replace(/</g, '\\u003c'),
          }}
        />
      </div>
    );
  };
}
