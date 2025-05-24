import Link from 'next/link';
import React from 'react';

import { Shield, Github } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

const mainLinks = [{ name: 'Связь: *****@yandex.ru', href: 'mailto:*****@yandex.ru' }];

const github = {
  name: 'GitHub',
  href: 'https://github.com/fred-yagofarov1314/anonymize-tool',
};

const FooterBase: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className={cn(
        'w-full transition-all duration-500 border-t border-border/25 bg-background/80 backdrop-blur-xl',
      )}
      role="contentinfo"
      style={{
        WebkitBackdropFilter: 'blur(16px)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 py-6 px-6 md:px-10 lg:px-16">
        {/* Логотип и копирайт */}
        <div className="flex items-center gap-2 min-w-0 mb-4 md:mb-0">
          <Link
            href="/"
            className="flex items-center gap-2 select-none focus-visible:ring-2 focus-visible:ring-primary outline-none group active:scale-95 transition-all duration-200 hover:text-primary no-underline"
            aria-label="На главную"
            tabIndex={0}
          >
            <Shield
              className="w-7 h-7 transition-colors duration-200 group-hover:text-primary"
              strokeWidth={2.2}
            />
            <span className="font-extrabold text-xl tracking-tight text-foreground leading-none transition-colors duration-200 group-hover:text-primary">
              Datashield
            </span>
          </Link>
          <span className="text-xs text-muted-foreground ml-2 truncate max-w-[180px] md:max-w-none">
            © {currentYear} Datashield. Безопасная анонимизация текстовых данных.
          </span>
        </div>
        {/* Навигация и соцсети */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 md:gap-4">
          {mainLinks.map(l => (
            <Link
              key={l.name}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150 px-5 py-2 rounded-xl focus-visible:ring-2 focus-visible:ring-primary outline-none no-underline"
              tabIndex={0}
            >
              {l.name}
            </Link>
          ))}
          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150 px-5 py-2 rounded-xl focus-visible:ring-2 focus-visible:ring-primary outline-none no-underline"
            aria-label="GitHub"
            tabIndex={0}
          >
            <Github className="w-5 h-5" strokeWidth={2.1} />
            <span className="font-semibold">{github.name}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export const Footer = withMemo(FooterBase);
