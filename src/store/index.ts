export type { IAuthState } from './slices/authSlice';
export type { IGoal, IGoalsState } from './slices/goalsSlice';
export type { IHabitsState } from './slices/habitsSlice';
export type { IUserState, IUserGoalPayload } from './slices/userSlice';
export type { TRootState, TAppDispatch } from './store';

export type { IAuth, IAuthTemplate } from './types/auth';
export type {
  IHabit,
  IHabitTemplate,
  THabitRealization,
  THabitRealizationValue,
  TStandardHabitFreq,
  THabitFreq,
} from './types/habit';
export type { IUser, IUserTemplate } from './types/user';

export { app, db } from '../services/firebase';
export { useAppDispatch, useAppSelector } from './hooks';
export { authSlice, login, logout } from './slices/authSlice';
export {
  goalsSlice,
  getUserGoals,
  createGoal,
  clearGoals,
} from './slices/goalsSlice';
export {
  habitsSlice,
  getUserHabits,
  createHabit,
  clearHabits,
  updateHabits,
} from './slices/habitsSlice';
export {
  userSlice,
  initUser,
  addUserGoal,
  addUserHabit,
  clearUser,
} from './slices/userSlice';
export { store } from './store';
