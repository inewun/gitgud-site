import React from 'react';

import { Footer } from '@/widgets/footer/ui/Footer';
import { Header } from '@/widgets/header/ui/Header';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Основной лейаут для страниц приложения
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
