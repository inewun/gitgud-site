import { useState, useCallback } from 'react';

interface UseAnonymizationOptions {
  initialMode?: boolean;
}

interface UseAnonymizationResult {
  isAnonymized: boolean;
  toggleAnonymization: () => void;
  anonymize: (text: string) => string;
  anonymizeEmail: (email: string) => string;
  anonymizePhone: (phone: string) => string;
}

/**
 * Хук для анонимизации данных в приложении
 */
export const useAnonymization = (options: UseAnonymizationOptions = {}): UseAnonymizationResult => {
  const [isAnonymized, setIsAnonymized] = useState(options.initialMode || false);

  const toggleAnonymization = useCallback(() => {
    setIsAnonymized(prev => !prev);
  }, []);

  const anonymize = useCallback(
    (text: string): string => {
      if (!isAnonymized) return text;
      return text.replace(/\S+/g, word => '*'.repeat(Math.min(word.length, 5)));
    },
    [isAnonymized],
  );

  const anonymizeEmail = useCallback(
    (email: string): string => {
      if (!isAnonymized) return email;
      const [username, domain] = email.split('@');
      if (!username || !domain) return email;

      const anonymizedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
      return `${anonymizedUsername}@${domain}`;
    },
    [isAnonymized],
  );

  const anonymizePhone = useCallback(
    (phone: string): string => {
      if (!isAnonymized) return phone;
      return phone.replace(/\d(?=\d{4})/g, '*');
    },
    [isAnonymized],
  );

  return {
    isAnonymized,
    toggleAnonymization,
    anonymize,
    anonymizeEmail,
    anonymizePhone,
  };
};
