'use client';

import { cn } from '@/styles/common';

export interface FooterPlaceholderProps {
  className?: string;
}

export function FooterPlaceholder({ className }: FooterPlaceholderProps) {
  return (
    <div className={cn('animate-pulse border-t bg-background h-64', className)}>
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
            <div className="h-6 w-40 bg-muted rounded"></div>
            <div className="h-4 w-64 bg-muted rounded"></div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="mt-4 space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-4 w-32 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
