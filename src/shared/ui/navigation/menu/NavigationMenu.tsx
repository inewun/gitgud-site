'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface NavigationMenuProps {
  items: NavItem[];
  variant?: 'default' | 'minimal';
  className?: string;
}

export function NavigationMenu({ items, variant = 'default', className }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Определяем активный элемент навигации на основе текущего пути
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className={className}>
      {/* Кнопка меню (бургер) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <span className="sr-only">Открыть меню</span>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Мобильное меню */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className={cn(
            'fixed inset-x-0 top-16 z-50 mt-px border-b bg-background pb-5 pt-4 shadow-lg animate-in slide-in-from-top-5',
            variant === 'minimal' ? 'px-4' : 'px-8',
          )}
        >
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute right-4 top-4 z-10 p-2 text-foreground/70 hover:text-primary"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <span className="sr-only">Закрыть меню</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          <nav className={className} role="navigation" aria-label="Мобильная навигация">
            <ul className="grid gap-3">
              {items.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                      isActive(item.href) && 'bg-accent text-accent-foreground font-medium',
                      item.disabled && 'pointer-events-none opacity-60',
                    )}
                    role="link"
                  >
                    {item.icon && (
                      <span className="mr-2" data-testid={`${item.label.toLowerCase()}-icon`}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Десктопная версия */}
      <nav className={className} role="navigation" aria-label="Основная навигация">
        <ul className="flex gap-4">
          {items.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  isActive(item.href) && 'bg-accent text-accent-foreground font-medium',
                  item.disabled && 'pointer-events-none opacity-60',
                )}
                role="link"
              >
                {item.icon && (
                  <span className="mr-2" data-testid={`${item.label.toLowerCase()}-icon`}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
