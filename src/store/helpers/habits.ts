import {
  THabitFreq,
  THabitRealization,
  THabitPeriodStatus,
  THabitDayStatus,
} from '../types/habit';
import { hextToRgbaString } from '../../utils/colors';

export const getReadableStatus = (
  status: THabitDayStatus | THabitPeriodStatus,
) => {
  switch (status) {
    case 'DONE':
      return 'done';
    case 'NOT-DONE':
      return 'planned, not done';
    case 'PART-DONE':
      return 'partly done';
    case 'WAITING':
      return 'in progress';
    case 'EMPTY':
      return 'not done';
    default:
      return 'not done';
  }
};

export const getStatusColor = (
  dayStatus?: THabitDayStatus,
  periodStatus?: THabitPeriodStatus,
) => {
  if (dayStatus === 'DONE') return '#008000';
  if (dayStatus === 'NOT-DONE') return '#8B0000';
  if (dayStatus === 'EMPTY') {
    if (periodStatus === 'DONE') return hextToRgbaString('#008000', 0.5);
    if (periodStatus === 'PART-DONE') return hextToRgbaString('#008000', 0.1);
    if (periodStatus === 'WAITING') return hextToRgbaString('#FFFF00', 0.5);
    if (periodStatus === 'NOT-DONE') return hextToRgbaString('#8B0000', 0.5);
  }
  return '#808080';
};

export const getPeriodLength = ({ type }: THabitFreq) => {
  switch (type) {
    case 'WEEKLY':
      return 7;
    case 'DAILY':
    default:
      return 1;
  }
};

export const getPeriodRequiredRealizations = ({ type }: THabitFreq) => {
  switch (type) {
    case 'WEEKLY':
    case 'DAILY':
    default:
      return 1;
  }
};

export const getPeriodRequirements = (frequency: THabitFreq) => {
  return {
    length: getPeriodLength(frequency),
    requiredRealizations: getPeriodRequiredRealizations(frequency),
  };
};

export const extendRealizationData = (
  frequency: THabitFreq,
  realization: THabitRealization[],
) => {
  if (!realization.length) return [];
  let result = [];
  if (frequency.type === 'DAILY') {
    result = realization.map((day) => ({
      ...day,
      periodStart: day.date,
      periodEnd: day.date,
      periodStatus:
        day.dayStatus === ('EMPTY' as THabitPeriodStatus)
          ? 'WAITING'
          : (day.dayStatus as THabitPeriodStatus),
    }));
    return result;
  }
  const periodRequirements = getPeriodRequirements(frequency);
  let periodCount = 0;
  let dayCount = 0;
  let periodStatus: THabitPeriodStatus = 'WAITING';
  let realizationsCount = 0;
  let periodDay = 0;
  while (dayCount < realization.length) {
    while (
      periodDay < periodRequirements.length &&
      dayCount + periodDay < realization.length
    ) {
      const dayStatus = realization[dayCount + periodDay].dayStatus;
      if (dayStatus === 'DONE') realizationsCount++;
      if (
        realizationsCount > 0 &&
        realizationsCount < periodRequirements.requiredRealizations
      )
        periodStatus = 'PART-DONE';
      if (realizationsCount >= periodRequirements.requiredRealizations)
        periodStatus = 'DONE';
      periodDay++;
      if (
        periodDay === periodRequirements.length &&
        !(periodStatus === 'PART-DONE' || periodStatus === 'DONE')
      )
        periodStatus = 'NOT-DONE';
    }
    const periodStart =
      realization[periodCount * periodRequirements.length].date;
    const periodEnd = realization[(periodCount + 1) * periodDay - 1].date;
    result.push({
      ...realization[dayCount],
      periodStart,
      periodEnd,
      periodStatus,
    });
    if (dayCount === periodCount * periodRequirements.length + periodDay - 1) {
      periodStatus = 'WAITING';
      realizationsCount = 0;
      periodDay = 0;
      periodCount++;
    }
    dayCount++;
  }
  return result;
};
