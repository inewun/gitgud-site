'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/shared/ui/inputs/button/Button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Избегаем расхождений в рендеринге
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  // Отображаем пустой div при server-side рендеринге
  if (!mounted) {
    return <div className={cn('w-9 h-9 sm:w-10 sm:h-10', className)} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary outline-none",
        "hover:bg-primary/10 hover:shadow-lg hover:scale-105 active:scale-95",
        "focus-visible:ring-offset-2 focus-visible:ring-primary",
        "rounded-xl",
        isAnimating && "animate-theme-toggle-pulse",
        className
      )}
      disabled={isAnimating}
      onClick={toggleTheme}
      aria-label={resolvedTheme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
      style={{ borderRadius: "var(--radius-xl)" }}
    >
      {isAnimating && (
        <span className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse pointer-events-none" />
      )}

      <Sun
        className="h-4.5 w-4.5 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />

      <Moon
        className="absolute h-4.5 w-4.5 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
    </Button>
  );
}
