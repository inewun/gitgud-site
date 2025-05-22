// Реэкспорт компонентов формы анонимизации

import { LazyComponent as LazyComponentImpl } from '@/shared/ui/utils/lazy-component';

import { AnonymizeForm, AnonymizeFormProps } from './AnonymizeForm';

import type { AnonymizeResult } from '../server/ResultsList';

export { AnonymizeForm };

// Создаем ленивую версию компонента формы
export const LazyAnonymizeForm = (props: AnonymizeFormProps) => {
  return (
    <LazyComponentImpl<AnonymizeFormProps>
      loader={() =>
        import('./AnonymizeForm').then(module => ({
          default: module.AnonymizeForm as React.ComponentType<AnonymizeFormProps>,
        }))
      }
      componentProps={props}
    />
  );
};

// Определяем тип для ResultsList
interface ResultsListProps {
  results?: AnonymizeResult[];
  isLoading?: boolean;
  className?: string;
}

// Другие компоненты, которые требуют ленивой загрузки
export const LazyAnonymizeResultsTable = (props: ResultsListProps) => {
  return (
    <LazyComponentImpl<ResultsListProps>
      loader={() =>
        import('../server/ResultsList').then(module => ({
          default: module.ResultsList as React.ComponentType<ResultsListProps>,
        }))
      }
      componentProps={props}
    />
  );
};

// Реэкспортируем типы для удобства использования
export type { AnonymizeFormProps, AnonymizeResult, ResultsListProps };
