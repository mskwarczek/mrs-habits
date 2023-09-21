import { THabitFreq, THabitRealization } from '../types/habit';

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
      periodStatus: day.dayStatus === 'EMPTY' ? 'WAITING' : day.dayStatus,
    }));
    return result;
  }
  const periodRequirements = getPeriodRequirements(frequency);
  let periodCount = 0;
  let dayCount = 0;
  let periodStatus = 'WAITING';
  let realizationsCount = 0;
  let periodDay = 0;
  while (dayCount < realization.length) {
    while (
      periodDay < periodRequirements.length &&
      dayCount + periodDay < realization.length
    ) {
      const dayStatus = realization[periodDay].dayStatus;
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
    const periodEnd = realization[periodDay - 1].date;
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
