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

import { initUser, clearUser } from '../index';

export interface IAuthState {
  displayName?: string;
  email?: string;
  uid?: string;
  authenticated?: boolean;
  error?: SerializedError;
}

export interface IAuthPayload {
  displayName?: string;
  email?: string;
  uid?: string;
}

const initialState: IAuthState = {
  displayName: undefined,
  email: undefined,
  uid: undefined,
  authenticated: undefined,
  error: undefined,
};

const provider = new GoogleAuthProvider();

export const login = createAsyncThunk<IAuthState>(
  'login',
  async (_, thunkAPI) => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, uid } = result.user;
      thunkAPI.dispatch(initUser(uid));
      return { displayName, email, uid } as IAuthPayload;
    } catch (error) {
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const logout = createAsyncThunk('logout', async (_, thunkAPI) => {
  try {
    const auth = getAuth();
    await signOut(auth);
    thunkAPI.dispatch(clearUser());
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
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.authenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.authenticated = false;
      state.displayName = initialState.displayName;
      state.email = initialState.email;
      state.uid = initialState.uid;
      state.error = initialState.error;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});
