import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { TRootState, TAppDispatch } from './index';

export const useAppDispatch: () => TAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
