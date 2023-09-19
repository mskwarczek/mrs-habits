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

// type TReminder = 'APP' | 'NOTIFICATION' | 'EMAIL'; // TODO

export type THabitRealizationValue = 'DONE' | 'EMPTY' | 'NOT-DONE';

export type THabitRealization = {
  date: string;
  dayStatus: THabitRealizationValue;
  note?: string;
};

export interface IHabitTemplate {
  id?: string;
  meta?: {
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  name?: string;
  owner?: string;
  frequency?: THabitFreq;
  defaultRealizationValue?: THabitRealizationValue;
  realization?: THabitRealization[];
  startDate?: string;
  endDate?: string;
  description?: string;
  // relatedGoals?: string[]; // TODO
  // displayInOvweview?: boolean; // TODO
  // reminder?: TReminder[]; TODO
}

export interface IHabit extends IHabitTemplate {
  id: string;
  meta: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
  name: string;
  owner: string;
  frequency: THabitFreq;
  defaultRealizationValue: THabitRealizationValue;
  realization: THabitRealization[];
  startDate: string;
  endDate?: string;
  description?: string;
}
