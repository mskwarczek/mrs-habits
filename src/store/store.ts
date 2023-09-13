import { configureStore } from '@reduxjs/toolkit';

import { authSlice, goalsSlice, habitsSlice, userSlice } from './index';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    goals: goalsSlice.reducer,
    habits: habitsSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
