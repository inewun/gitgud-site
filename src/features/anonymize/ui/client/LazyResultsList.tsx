import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { History } from 'lucide-react';

import type { AnonymizeResult } from '../server/ResultsList';

// Плейсхолдер для загрузки в стиле 2025
const ResultsListPlaceholder = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-7 w-4/5 bg-muted/30 rounded-lg"></div>
    <div className="space-y-3">
      <div className="h-5 bg-muted/30 rounded-lg"></div>
      <div className="h-5 bg-muted/30 rounded-lg"></div>
      <div className="h-5 w-3/4 bg-muted/30 rounded-lg"></div>
    </div>
  </div>
);

// Динамический импорт компонента ResultsList
const ResultsListComponent = dynamic<{ results: AnonymizeResult[] }>(
  () => import('../server/ResultsList').then(mod => mod.ResultsList),
  {
    loading: () => <ResultsListPlaceholder />,
    ssr: true,
  },
);

export interface LazyResultsListProps {
  results: AnonymizeResult[];
}

/**
 * Обертка для ленивой загрузки компонента ResultsList
 * Обновлена для дизайна 2025 года
 */
export function LazyResultsList({ results }: LazyResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="bg-muted/20 w-12 h-12 rounded-full flex items-center justify-center mb-3">
          <History className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground font-medium">История анонимизации пуста</p>
        <p className="text-muted-foreground/70 text-sm mt-1 max-w-xs">
          Результаты обработанных текстов будут отображаться здесь
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in transition-all duration-300 space-y-2">
      <Suspense fallback={<ResultsListPlaceholder />}>
        <ResultsListComponent results={results} />
      </Suspense>
    </div>
  );
}
