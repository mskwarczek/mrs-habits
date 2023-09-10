export type { IAuthState, IAuthPayload } from './slices/authSlice';
export type { IUserState, IUserPayload } from './slices/userSlice';
export type { TRootState, TAppDispatch } from './store';

export { app, db } from '../services/firebase';
export { useAppDispatch, useAppSelector } from './hooks';
export { authSlice, login, logout } from './slices/authSlice';
export { userSlice, initUser, clearUser } from './slices/userSlice';
export { store } from './store';
