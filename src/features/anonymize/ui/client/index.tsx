// Реэкспорт компонентов формы анонимизации

import { LazyComponent as LazyComponentImpl } from '@/shared/ui/utils/lazy-component';

import { AnonymizeForm, AnonymizeFormProps } from './AnonymizeForm';
import { AnonymizeErrorDisplay } from './AnonymizeErrorDisplay';
import { LazyResultsList } from './LazyResultsList';

import type { AnonymizeResult } from '../server/ResultsList';

export { AnonymizeForm, AnonymizeErrorDisplay, LazyResultsList };

// Создаем ленивую версию компонента формы
export const LazyAnonymizeForm = (props: AnonymizeFormProps) => {
  return (
    <LazyComponentImpl<AnonymizeFormProps>
      loader={() =>
        import('./AnonymizeForm').then(module => ({
          default: module.AnonymizeForm,
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
          default: module.ResultsList,
        }))
      }
      componentProps={props}
    />
  );
};

// Реэкспортируем типы для удобства использования
export type { AnonymizeFormProps, AnonymizeResult, ResultsListProps };
