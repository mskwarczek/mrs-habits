import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { getDoc, setDoc, updateDoc, collection, doc } from 'firebase/firestore';

import {
  db,
  IHabit,
  getUserGoals,
  getUserHabits,
  updateHabits,
} from '../index';

export interface IUser {
  uid?: string;
  goals?: string[];
  habits?: string[];
}

export interface IUserState extends IUser {
  error?: SerializedError;
}

export interface IUserGoalPayload {
  userId: string;
  goalId: string;
}

export interface IUserHabitPayload {
  userId: string;
  habitId: string;
}

const initialState: IUserState = {
  uid: undefined,
  goals: undefined,
  habits: undefined,
  error: undefined,
};

const shouldHabitsUpdate = (data: IHabit[] | undefined) => {
  if (!data) return false;
  let shouldUpdate = false;
  data.map((habit) => {
    if (!habit.meta?.updatedAt || new Date(habit.meta?.updatedAt) < new Date())
      shouldUpdate = true;
  });
  return shouldUpdate;
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
        const habits = userData?.habits;
        if (goals && goals.length) thunkAPI.dispatch(getUserGoals(goals));
        if (habits && habits.length)
          thunkAPI
            .dispatch(getUserHabits(habits))
            .unwrap()
            .then((result) => {
              if (shouldHabitsUpdate(result)) thunkAPI.dispatch(updateHabits());
            });
        return { uid, goals, habits } as IUser;
      } else {
        const usersRef = collection(db, 'users');
        await setDoc(doc(usersRef, uid), {
          goals: [],
          habits: [],
        });
        return { uid, goals: [], habits: [] } as IUser;
      }
    } catch (error) {
      console.error('ERROR!', error);
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
        const goals = userData.goals ? userData.goals : [];
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
      console.error('ERROR!', error);
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const addUserHabit = createAsyncThunk(
  'addUserHabit',
  async ({ userId, habitId }: IUserHabitPayload, thunkAPI) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const habits = userData.habits ? userData.habits : [];
        if (!habits.includes(habitId)) {
          await updateDoc(docRef, {
            habits: [...habits, habitId],
          });
          return {
            uid: userId,
            habits: [...habits, habitId],
          } as IUser;
        } else {
          throw new Error(
            `Error in action addUserHabit. Habit with given ID (${habitId}) already exists on this user (${userId}).`,
          );
        }
      } else {
        throw new Error(
          `Error in action addUserHabit. User with given ID doesn't exist (${userId}).`,
        );
      }
    } catch (error) {
      console.error('ERROR!', error);
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
      state.habits = initialState.habits;
      state.error = initialState.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initUser.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.goals = action.payload.goals;
      state.habits = action.payload.habits;
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
    builder.addCase(addUserHabit.fulfilled, (state, action) => {
      state.uid = action.payload.uid;
      state.habits = action.payload.habits;
    });
    builder.addCase(addUserHabit.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
