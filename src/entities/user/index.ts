// Экспорт типов
export * from './model/types';

// Экспорт слайса
export {
  userSlice,
  userReducer,
  setUserProfile,
  setUserLoading,
  clearUserProfile,
  setUserError,
} from './model/slice';

// Селекторы
export const selectUserProfile = (state: { user: import('./model/types').UserState }) =>
  state.user.profile;

export const selectUserLoading = (state: { user: import('./model/types').UserState }) =>
  state.user.isLoading;

export const selectUserError = (state: { user: import('./model/types').UserState }) =>
  state.user.error;
