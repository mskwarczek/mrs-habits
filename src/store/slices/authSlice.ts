import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';

import type { IAuth } from '../../types';
import { initUser, clearUser, clearGoals } from '../index';

export interface IAuthState {
  data?: IAuth;
  authenticated?: boolean;
  error?: SerializedError;
}

const initialState: IAuthState = {
  data: undefined,
  authenticated: undefined,
  error: undefined,
};

const provider = new GoogleAuthProvider();

export const login = createAsyncThunk('login', async (_, thunkAPI) => {
  try {
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    const { displayName, email, uid } = result.user;
    thunkAPI.dispatch(initUser(uid));
    return { displayName, email, uid } as IAuth;
  } catch (error) {
    if (error instanceof Error)
      return thunkAPI.rejectWithValue({ error: error.message });
    else return thunkAPI.rejectWithValue({ error });
  }
});

export const logout = createAsyncThunk('logout', async (_, thunkAPI) => {
  try {
    const auth = getAuth();
    await signOut(auth);
    thunkAPI.dispatch(clearUser());
    thunkAPI.dispatch(clearGoals());
  } catch (error) {
    if (error instanceof Error)
      return thunkAPI.rejectWithValue({ error: error.message });
    else return thunkAPI.rejectWithValue({ error });
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.data = action.payload;
      state.authenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.authenticated = false;
      state.data = initialState.data;
      state.error = initialState.error;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});
