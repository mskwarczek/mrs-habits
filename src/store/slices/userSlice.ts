import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { getDoc, setDoc, collection, doc } from 'firebase/firestore';

import { db } from '../index';

export interface IUserState {
  name?: string;
  uid?: string;
  goals?: string[];
  error?: SerializedError;
}

export interface IUserPayload {
  uid?: string;
  goals?: string[];
}

const initialState: IUserState = {
  name: undefined,
  uid: undefined,
  goals: undefined,
  error: undefined,
};

export const initUser = createAsyncThunk(
  'initUser',
  async (uid: string, thunkAPI) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const goals = userData?.goals;
        return { uid, goals } as IUserPayload;
      } else {
        const usersRef = collection(db, 'users');
        await setDoc(doc(usersRef, uid), {
          goals: [],
        });
        return { uid, goals: [] } as IUserPayload;
      }
    } catch (error) {
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.name = initialState.name;
      state.uid = initialState.uid;
      state.goals = initialState.goals;
      state.error = initialState.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initUser.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.goals = action.payload.goals;
    });
    builder.addCase(initUser.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
