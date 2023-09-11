export type { IAuthState, IAuthPayload } from './slices/authSlice';
export type { IGoal, IGoalsState } from './slices/goalsSlice';
export type { IUser, IUserState, IUserGoalPayload } from './slices/userSlice';
export type { TRootState, TAppDispatch } from './store';

export { app, db } from '../services/firebase';
export { useAppDispatch, useAppSelector } from './hooks';
export { authSlice, login, logout } from './slices/authSlice';
export { goalsSlice, getUserGoals, createGoal, clearGoals } from './slices/goalsSlice';
export {
  userSlice,
  initUser,
  addUserGoal,
  clearUser,
} from './slices/userSlice';
export { store } from './store';
