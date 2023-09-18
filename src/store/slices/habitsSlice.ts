import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import {
  doc,
  getDocs,
  addDoc,
  collection,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../index';
import { addDays } from '../../utils/datetime';

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

export type THabitRealizationValue = 'DONE' | 'EMPTY' | 'NOT-DONE';
export type THabitRealization = {
  date: string;
  dayStatus: THabitRealizationValue;
  note?: string;
};

export interface IHabit {
  id?: string;
  owner?: string;
  meta?: {
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  name?: string;
  frequency?: THabitFreq;
  defaultRealizationValue?: THabitRealizationValue;
  realization?: THabitRealization[];
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
  async (habits: string[], thunkAPI) => {
    try {
      const habitsToAdd: IHabit[] = [];
      const response = await getDocs(collection(db, 'habits'));
      response.forEach((doc) => {
        if (habits.includes(doc.id))
          habitsToAdd.push(<IHabit>{ ...doc.data(), id: doc.id });
      });
      return habitsToAdd as IHabit[];
    } catch (error) {
      console.error('ERROR!', error);
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
      console.error('ERROR!', error);
      if (error instanceof Error)
        return thunkAPI.rejectWithValue({ error: error.message });
      else return thunkAPI.rejectWithValue({ error });
    }
  },
);

export const updateHabits = createAsyncThunk(
  'updateHabits',
  async (_, thunkAPI) => {
    try {
      const batch = writeBatch(db);
      const updateData = new Map();
      const { habits } = thunkAPI.getState() as { habits: IHabitsState };
      habits.data?.map((habit) => {
        if (
          typeof habit.id !== 'undefined' &&
          typeof habit.realization !== 'undefined' &&
          typeof habit.startDate != 'undefined' &&
          typeof habit.defaultRealizationValue != 'undefined' &&
          typeof habit.frequency != 'undefined'
        ) {
          const docRef = doc(db, 'habits', habit.id);
          const realization: THabitRealization[] = habit.realization.map(
            (a) => {
              return { ...a };
            },
          );
          const today = new Date().setHours(0, 0, 0, 0);
          let selectedDay = new Date(habit.startDate);
          let selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
          if (realization.length > 0) {
            const lastRealization = realization[realization.length - 1];
            if (
              new Date(lastRealization.date).setHours(0, 0, 0, 0) < today &&
              habit.frequency.type === 'DAILY' &&
              lastRealization.dayStatus === 'EMPTY'
            )
              realization[realization.length - 1].dayStatus =
                habit.defaultRealizationValue;
            selectedDay = addDays(new Date(lastRealization.date), 1);
            selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
          }
          while (selectedDayHours <= today) {
            const date = selectedDay.toString();
            const dayStatus: THabitRealizationValue =
              selectedDayHours < today
                ? habit.defaultRealizationValue
                : 'EMPTY';
            realization.push({
              date,
              dayStatus,
            });
            selectedDay = addDays(selectedDay, 1);
            selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
          }
          batch.update(docRef, { realization: realization });
          batch.update(docRef, { 'meta.updatedAt': today.toString() });
          updateData.set(habit.id, realization);
        }
      });
      await batch.commit();
      return {
        updateData,
        updatedAt: new Date().toString(),
      };
    } catch (error) {
      console.error('ERROR!', error);
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
    builder.addCase(updateHabits.fulfilled, (state, action) => {
      state.data?.forEach((habit) => {
        if (habit.id) {
          if (action.payload.updateData.has(habit.id)) {
            const updateData = action.payload.updateData.get(habit.id);
            habit.realization = updateData;
            if (habit.meta) habit.meta.updatedAt = action.payload.updatedAt;
          }
        }
      });
    });
    builder.addCase(updateHabits.rejected, (state, action) => {
      state.error = action.error;
    });
  },
});

export const { clearHabits } = habitsSlice.actions;

export default habitsSlice.reducer;
