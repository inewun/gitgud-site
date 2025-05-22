import { useCallback } from 'react';

import { getIntl, formatMessage } from '@/lib/i18n/index';

/**
 * Хук для работы с локализацией в компонентах
 * @param locale - Локаль, для которой нужны переводы (опционально)
 * @returns Объект с функцией t для получения перевода
 */
export const useTranslation = (locale = 'ru') => {
  const intl = getIntl(locale);

  const t = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (id: string, values?: Record<string, any>): string => {
      return formatMessage(intl, id, values);
    },
    [intl],
  );

  return { t, locale };
};

export default useTranslation;
