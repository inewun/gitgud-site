'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { cn } from '@/shared/lib/utils';

export interface MobileNavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface MobileNavigationProps {
  /** Элементы навигации */
  items: MobileNavigationItem[];
  /** Дополнительные классы */
  className?: string;
  /** Текст кнопки открытия меню */
  toggleButtonText?: string;
  /** Иконка для кнопки открытия/закрытия (когда меню закрыто) */
  openIcon?: React.ReactNode;
  /** Иконка для кнопки открытия/закрытия (когда меню открыто) */
  closeIcon?: React.ReactNode;
}

/**
 * Компонент мобильной навигации с выпадающим меню
 * Предназначен для использования на маленьких экранах
 */
export function MobileNavigation({
  items,
  className,
  toggleButtonText = 'Меню',
  openIcon = '☰',
  closeIcon = '✕',
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Закрываем меню при клике на ссылку
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn('md:hidden w-full h-full flex items-center justify-center', className)}>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center justify-center w-full h-full rounded-2xl hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary shadow-lg active:scale-95"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        style={{ borderRadius: "var(--radius-2xl)" }}
      >
        <span className="sr-only">{toggleButtonText}</span>
        <span aria-hidden="true">{isOpen ? closeIcon : openIcon}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 sm:top-[4.5rem] md:top-20 z-50 bg-background/90 backdrop-blur-lg border-t border-b border-border/30 shadow-xl">
          <nav className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <ul className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
              {items.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <li key={index} className="w-auto">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center text-center py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl transition-colors font-medium text-sm sm:text-base',
                        'hover:bg-primary/10 hover:text-primary',
                        isActive && 'bg-primary/10 text-primary shadow-sm',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={handleLinkClick}
                    >
                      {item.icon && <span className="mr-2 sm:mr-3">{item.icon}</span>}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
