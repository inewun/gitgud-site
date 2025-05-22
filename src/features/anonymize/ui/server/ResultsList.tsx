import React from 'react';

import { typography, containers, animations, borders } from '@/styles/compositions';

export interface AnonymizeResult {
  id: string;
  originalText: string;
  anonymizedText: string;
  timestamp: string;
  metadata?: {
    replacedNames?: number;
    replacedEmails?: number;
    replacedPhones?: number;
    replacedDates?: number;
    replacedAddresses?: number;
    replacedIPs?: number;
  };
}

interface ResultsListProps {
  results?: AnonymizeResult[];
  isLoading?: boolean;
  className?: string;
}

// Серверный компонент для показа истории результатов
export async function ResultsList({
  results = [],
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isLoading = false,
  className = '',
}: ResultsListProps) {
  // Здесь может быть серверная логика получения результатов

  // Добавим искусственную задержку для имитации асинхронной операции
  await new Promise(resolve => setTimeout(resolve, 10));

  if (isLoading) {
    return (
      <div className={`${containers.card} ${className}`}>
        <h3 className={typography.heading3}>История результатов</h3>
        <div className={animations.pulse}>
          <div className={`h-10 bg-subtle dark:bg-card ${borders.rounded} mb-4`}></div>
          <div className={`h-10 bg-subtle dark:bg-card ${borders.rounded} mb-4`}></div>
          <div className={`h-10 bg-subtle dark:bg-card ${borders.rounded}`}></div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`${containers.card} ${className}`}>
        <h3 className={typography.heading3}>История результатов</h3>
        <p className={typography.caption}>История анонимизации пуста</p>
      </div>
    );
  }

  return (
    <div className={`${containers.card} ${className}`}>
      <h3 className={typography.heading3}>История результатов</h3>

      <ul className="mt-4 space-y-4">
        {results.map(result => (
          <li
            key={result.id}
            className={`${borders.default} ${borders.rounded} p-3 hover:bg-subtle dark:hover:bg-card`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={typography.heading4}>{new Date(result.timestamp).toLocaleString()}</p>
                <p className={typography.caption}>
                  {result.originalText.substring(0, 100)}
                  {result.originalText.length > 100 ? '...' : ''}
                </p>
              </div>

              {result.metadata && (
                <div className={`${typography.small} space-y-1`}>
                  {result.metadata.replacedNames !== undefined && (
                    <p>Имена: {result.metadata.replacedNames}</p>
                  )}
                  {result.metadata.replacedEmails !== undefined && (
                    <p>Email: {result.metadata.replacedEmails}</p>
                  )}
                  {result.metadata.replacedPhones !== undefined && (
                    <p>Телефоны: {result.metadata.replacedPhones}</p>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
