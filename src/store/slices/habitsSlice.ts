import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import type { IHabit, THabitRealization, THabitDayStatus } from '../../types';
import { getProperDateString, addDays } from '../../utils/datetime';
import { db } from '../../services/firebase';

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

interface IEditHabitRealizationPayload {
  habitId: string;
  date: string;
  values: {
    dayStatus?: THabitDayStatus;
    note?: string;
  };
}

export const editHabitRealization = createAsyncThunk(
  'editHabitRealization',
  async (editPayload: IEditHabitRealizationPayload, thunkAPI) => {
    try {
      const docRef = doc(db, 'habits', editPayload.habitId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const newStatus = editPayload.values.dayStatus;
        const newNote = editPayload.values.note;
        const docData = docSnap.data();
        const editedRealization = docData.realization.map(
          (day: THabitRealization) => {
            if (day.date === editPayload.date)
              return {
                ...day,
                ...(newStatus && { dayStatus: newStatus }),
                ...(newNote && { note: newNote }),
              };
            return day;
          },
        );
        await updateDoc(docRef, { realization: editedRealization });
        return {
          id: editPayload.habitId,
          realization: editedRealization,
          updatedAt: new Date().toISOString(),
        };
      } else {
        throw new Error(
          `Error in action editHabitRealization. Habit with given ID doesn't exist (${editPayload.habitId}).`,
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

export const updateHabits = createAsyncThunk(
  'updateHabits',
  async (_, thunkAPI) => {
    try {
      const batch = writeBatch(db);
      const updateData: {
        habitId: string;
        realization: THabitRealization[];
      }[] = [];
      const { habits } = thunkAPI.getState() as { habits: IHabitsState };
      habits.data?.map((habit) => {
        const docRef = doc(db, 'habits', habit.id);
        const realization: THabitRealization[] = habit.realization.map((a) => {
          return { ...a };
        });
        const today = new Date().setHours(0, 0, 0, 0);
        const endDate = habit.endDate
          ? new Date(habit.endDate).setHours(0, 0, 0, 0)
          : false;
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
              habit.defaultDayStatus;
          selectedDay = addDays(new Date(lastRealization.date), 1);
          selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
        }
        while (
          selectedDayHours <= today &&
          (!endDate || selectedDayHours <= endDate)
        ) {
          const date = getProperDateString(selectedDay);
          const dayStatus: THabitDayStatus =
            selectedDayHours < today ? habit.defaultDayStatus : 'EMPTY';
          realization.push({
            date,
            dayStatus,
          });
          selectedDay = addDays(selectedDay, 1);
          selectedDayHours = selectedDay.setHours(0, 0, 0, 0);
        }
        batch.update(docRef, { realization: realization });
        batch.update(docRef, { 'meta.updatedAt': new Date().toISOString() });
        updateData.push({
          habitId: habit.id,
          realization,
        });
      });
      await batch.commit();
      return {
        updateData,
        updatedAt: new Date().toISOString(),
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
    builder.addCase(editHabitRealization.fulfilled, (state, action) => {
      const habitIdx = state.data?.findIndex(
        (habit) => habit.id === action.payload.id,
      );
      if (state.data && habitIdx && state.data[habitIdx]) {
        state.data[habitIdx].realization = action.payload.realization;
        state.data[habitIdx].meta.updatedAt = action.payload.updatedAt;
      }
    });
    builder.addCase(editHabitRealization.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(updateHabits.fulfilled, (state, action) => {
      action.payload.updateData.map((elem) => {
        const habitIdx = state.data?.findIndex(
          (habit) => habit.id === elem.habitId,
        );
        if (state.data && habitIdx && state.data[habitIdx]) {
          state.data[habitIdx].realization = elem.realization;
          state.data[habitIdx].meta.updatedAt = action.payload.updatedAt;
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
