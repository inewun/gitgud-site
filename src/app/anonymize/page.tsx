import { Metadata } from 'next';
import React from 'react';

import { AnonymizeWidget } from '@/widgets/anonymize';

export const metadata: Metadata = {
  title: 'Анонимизация данных | Datashield',
  description: 'Инструмент для анонимизации персональных данных в текстах',
};

export default function AnonymizePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center w-full">
      <AnonymizeWidget />
    </main>
  );
}
