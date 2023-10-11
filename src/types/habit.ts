export type TStandardHabitFreq = 'DAILY' | 'WEEKLY' | 'X-PER-WEEK';
export type TXPerPeriodHabitFreq = 'X-PER-WEEK';

export type THabitFreq =
  | { category: 'STANDARD'; type: TStandardHabitFreq }
  | { category: 'X-PER-PERIOD'; type: TXPerPeriodHabitFreq; value: string };
//  | { category: 'SPECIFIC', type: 'DAYHOUR-SPECIFIC', value: string } // TODO
//  | { category: 'SPECIFIC', type: 'WEEKDAY-SPECIFIC', value: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN' } // TODO
//  | { category: 'SPECIFIC', type: 'MONTHDAY-SPECIFIC', value: number }; // TODO

// type TReminder = 'APP' | 'NOTIFICATION' | 'EMAIL'; // TODO

export type THabitDayStatus = 'DONE' | 'EMPTY' | 'NOT-DONE';
export type THabitPeriodStatus =
  | 'DONE'
  | 'PARTIALLY-DONE'
  | 'WAITING'
  | 'NOT-DONE';

export type THabitRealization = {
  date: string;
  dayStatus: THabitDayStatus;
  note?: string;
};

export interface IHabitGridDay extends Partial<THabitRealization> {
  date: string;
  periodStart?: string;
  periodEnd?: string;
  periodStatus?: THabitPeriodStatus;
  isToday: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  isOutOfScope: boolean;
}

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
  defaultDayStatus?: THabitDayStatus;
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
  defaultDayStatus: THabitDayStatus;
  realization: THabitRealization[];
  startDate: string;
  endDate?: string;
  description?: string;
}
