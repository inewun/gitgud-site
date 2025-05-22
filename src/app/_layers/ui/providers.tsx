import { ReactNode } from 'react';

import { ThemeProvider } from '@/shared/ui/theme/providers';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
