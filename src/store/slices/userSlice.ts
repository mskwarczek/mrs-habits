import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { getDoc, setDoc, updateDoc, collection, doc } from 'firebase/firestore';

import { db } from '../index';

export interface IUser {
  uid?: string;
  goals?: string[];
}

export interface IUserState extends IUser {
  error?: SerializedError;
}

export interface IUserGoalPayload {
  userId: string;
  goalId: string;
}

const initialState: IUserState = {
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
        return { uid, goals } as IUser;
      } else {
        const usersRef = collection(db, 'users');
        await setDoc(doc(usersRef, uid), {
          goals: [],
        });
        return { uid, goals: [] } as IUser;
      }
    } catch (error) {
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const addUserGoal = createAsyncThunk(
  'addUserGoal',
  async ({ userId, goalId }: IUserGoalPayload, thunkAPI) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const goals = userData?.goals;
        if (!goals.includes(goalId)) {
          await updateDoc(docRef, {
            goals: [...goals, goalId],
          });
          return {
            uid: userId,
            goals: [...goals, goalId],
          } as IUser;
        } else {
          throw new Error(
            `Error in action addUserGoal. Goal with given ID (${goalId}) already exists on this user (${userId}).`,
          );
        }
      } else {
        throw new Error(
          `Error in action addUserGoal. User with given ID doesn't exist (${userId}).`,
        );
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
    builder.addCase(addUserGoal.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.goals = action.payload.goals;
    });
    builder.addCase(addUserGoal.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
