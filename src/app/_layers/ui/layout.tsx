import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from '@/app/_layers/ui/providers';

export const metadata: Metadata = {
  title: 'Anonymize Tool - Безопасная локальная анонимизация данных',
  description: 'Инструмент для анонимизации текстовых данных локально и безопасно',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
