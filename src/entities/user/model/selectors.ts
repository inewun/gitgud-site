import { useSelector } from 'react-redux';

import { UserProfile } from './types';

// Определение структуры стора для типизации
interface RootState {
  user: {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
  };
}

/**
 * Хук для получения данных пользователя из стора
 */
export const useUser = (): {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
} => {
  const profile = useSelector((state: RootState) => state.user.profile);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);

  return { profile, isLoading, error };
};
