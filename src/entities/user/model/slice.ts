import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserProfile, UserState } from './types';

const initialState: UserState = {
  profile: null,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state: UserState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setUserProfile: (state: UserState, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      state.isLoading = false;
      state.error = null;
    },
    clearUserProfile: (state: UserState) => {
      state.profile = null;
    },
    setUserError: (state: UserState, action: PayloadAction<string>) => {
      state.error = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      state.isLoading = false;
    },
  },
});

export const { setUserLoading, setUserProfile, clearUserProfile, setUserError } = userSlice.actions;

export const userActions = userSlice.actions;

export const userReducer = userSlice.reducer;
