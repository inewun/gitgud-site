'use client';

import React, { useEffect, useState } from 'react';

interface AccessibleFocusProps {
  children: React.ReactNode;
  className?: string;
}

export function AccessibleFocus({ children, className = '' }: AccessibleFocusProps) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsUsingKeyboard(true);
      }
    };

    const handleMouseDown = () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      setIsUsingKeyboard(false);
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.addEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div
      className={`${className} ${isUsingKeyboard ? 'outline outline-blue-500' : 'outline-none'}`}
      data-testid="accessible-focus"
      role="button"
      tabIndex={0}
      aria-label={typeof children === 'string' ? children : 'Фокусируемый контент'}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
