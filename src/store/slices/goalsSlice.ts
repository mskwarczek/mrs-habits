import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { addDoc, collection } from 'firebase/firestore';

import { db } from '../index';

export interface IGoal {
  name: string;
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface IGoalsState {
  data?: IGoal[];
  error?: SerializedError;
}

const initialState: IGoalsState = {
  data: undefined,
  error: undefined,
};

export const createGoal = createAsyncThunk(
  'createGoal',
  async (goal: IGoal, thunkAPI) => {
    try {
      const goalsRef = collection(db, 'goals');
      const docRef = await addDoc(goalsRef, goal);
      return { ...goal, id: docRef.id } as IGoal;
    } catch (error) {
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearGoals(state) {
      state.data = initialState.data;
      state.error = initialState.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createGoal.fulfilled, (state, action) => {
      if (state.data) state.data.push(action.payload);
      else state.data = [action.payload];
    });
    builder.addCase(createGoal.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { clearGoals } = goalsSlice.actions;

export default goalsSlice.reducer;
