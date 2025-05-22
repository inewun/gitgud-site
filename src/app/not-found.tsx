import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/inputs/button';
import { layout, typography } from '@/styles/compositions';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-fade-in px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-primary mb-4 tracking-tight">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-lg text-muted-foreground mb-10">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <Link href="/">
          <Button className="px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg shadow-md hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all duration-200">
            <ArrowLeft className="h-5 w-5 mr-2" />Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
