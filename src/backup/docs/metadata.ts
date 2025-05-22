import { Metadata } from 'next';

import { generateMetadata as genMeta } from '@/lib/metadata';

export const metadata: Metadata = genMeta({
  title: 'Документация по анонимизации',
  description:
    'Подробное руководство по использованию инструмента анонимизации данных, API и интеграции',
  keywords: [
    'документация',
    'руководство',
    'API',
    'интеграция',
    'анонимизация',
    'персональные данные',
  ],
  robots: 'index, follow',
});
