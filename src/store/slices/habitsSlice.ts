import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { getDocs, addDoc, collection } from 'firebase/firestore';

import { db } from '../index';

export type TStandardHabitFreq =
  | 'HOURLY'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'YEARLY';

export type THabitFreq = { category: 'STANDARD'; type: TStandardHabitFreq };
//  | { category: 'TIMES', type: 'HOUR-TIMES' | 'DAY-TIMES' | 'WEEK-TIMES' | 'MONTH-TIMES' | 'YEAR-TIMES', value: number } // TODO
//  | { category: 'SPECIFIC', type: 'DAYHOUR-SPECIFIC', value: string } // TODO
//  | { category: 'SPECIFIC', type: 'WEEKDAY-SPECIFIC', value: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' } // TODO
//  | { category: 'SPECIFIC', type: 'MONTHDAY-SPECIFIC', value: number }; // TODO

// type TMeasurement = // This is actaully more like goals thing. For habits done / not done should be enough
//   { categoy: 'PREDEFINED', type: 'BOOL' | 'NOTE_1_5'  }
//   | { categoy: 'VALUED', type: 'ABSOLUTE_VAL', unit: string }
//   | { categoy: 'VALUED', type: 'RELATIVE_VAL', unit: string, relatedValue: number }

// type TReminder = 'APP' | 'NOTIFICATION' | 'EMAIL'; // TODO

export interface IHabit {
  id?: string;
  owner?: string;
  meta?: {
    createdBy?: string;
    createdAt?: string;
  };
  name?: string;
  frequency?: THabitFreq;
  // measurement?: {
  //   type?: TMeasurement;
  //   unit?: string;
  // };
  startDate?: string;
  endDate?: string;
  description?: string;
  // relatedGoals?: string[]; // TODO
  // displayInOvweview?: boolean; // TODO
  // reminder?: TReminder[]; TODO
}

export interface IHabitsState {
  data?: IHabit[];
  error?: SerializedError;
}

const initialState: IHabitsState = {
  data: undefined,
  error: undefined,
};

export const getUserHabits = createAsyncThunk(
  'getUserHabits',
  async (goals: string[], thunkAPI) => {
    try {
      const goalsToAdd: IHabit[] = [];
      const response = await getDocs(collection(db, 'habits'));
      response.forEach((doc) => {
        if (goals.includes(doc.id))
          goalsToAdd.push(<IHabit>{ ...doc.data(), id: doc.id });
      });
      return goalsToAdd as IHabit[];
    } catch (error) {
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const createHabit = createAsyncThunk(
  'createHabit',
  async (habit: IHabit, thunkAPI) => {
    try {
      const habitsRef = collection(db, 'habits');
      const docRef = await addDoc(habitsRef, habit);
      return { ...habit, id: docRef.id } as IHabit;
    } catch (error) {
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    clearHabits(state) {
      state.data = initialState.data;
      state.error = initialState.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserHabits.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(getUserHabits.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(createHabit.fulfilled, (state, action) => {
      if (state.data) state.data.push(action.payload);
      else state.data = [action.payload];
    });
    builder.addCase(createHabit.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { clearHabits } = habitsSlice.actions;

export default habitsSlice.reducer;
