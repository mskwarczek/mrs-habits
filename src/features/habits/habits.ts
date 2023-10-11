import {
  THabitFreq,
  THabitRealization,
  THabitPeriodStatus,
  THabitDayStatus,
  IHabitGridDay,
} from '../../types/habit';
import { hextToRgbaString } from '../../utils/colors';
import {
  getProperDateString,
  getTimeBetweenDates,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  getEarlierDate,
  addDays,
} from '../../utils/datetime';

export const getReadableStatus = (
  status: THabitDayStatus | THabitPeriodStatus,
) => {
  switch (status) {
    case 'DONE':
      return 'done';
    case 'NOT-DONE':
      return 'planned, not done';
    case 'PARTIALLY-DONE':
      return 'partially done';
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
    if (periodStatus === 'DONE') return hextToRgbaString('#008000', 0.6);
    if (periodStatus === 'PARTIALLY-DONE')
      return hextToRgbaString('#008000', 0.2);
    if (periodStatus === 'WAITING') return hextToRgbaString('#FFFF00', 0.5);
    if (periodStatus === 'NOT-DONE') return hextToRgbaString('#8B0000', 0.5);
  }
  return '#808080';
};

export const getPeriodLength = ({ type }: THabitFreq) => {
  switch (type) {
    case 'WEEKLY':
    case 'X-PER-WEEK':
      return 7;
    case 'DAILY':
    default:
      return 1;
  }
};

export const getPeriodRequiredRealizations = (frequency: THabitFreq) => {
  switch (frequency.type) {
    case 'X-PER-WEEK':
      return frequency.category === 'X-PER-PERIOD'
        ? parseInt(frequency.value)
        : 1;
    case 'WEEKLY':
    case 'DAILY':
    default:
      return 1;
  }
};

const getPeriodEndDate = (
  realization: THabitRealization[],
  habitEndDate?: string,
) => {
  if (!realization.length) return getProperDateString(new Date());
  const realizationEnd = realization[realization.length - 1].date;
  if (habitEndDate && realizationEnd === habitEndDate) return realizationEnd;
  if (habitEndDate && realizationEnd !== habitEndDate)
    return getProperDateString(
      getEarlierDate(habitEndDate, getLastDayOfWeek(realizationEnd)),
    );
  return getProperDateString(getLastDayOfWeek(realizationEnd));
};

export const getPeriodOffsets = (
  frequency: THabitFreq,
  realization: THabitRealization[],
) => {
  const defaultValue = {
    startOffset: 0,
    realizationEndOffset: 0,
  };
  if (!realization.length) return defaultValue;

  const realizationStart = realization[0].date;
  const realizationEnd = realization[realization.length - 1].date;

  switch (frequency.type) {
    case 'WEEKLY':
    case 'X-PER-WEEK':
      return {
        startOffset: getTimeBetweenDates(
          getFirstDayOfWeek(realizationStart),
          realizationStart,
        ).days,
        realizationEndOffset: getTimeBetweenDates(
          realizationEnd,
          getLastDayOfWeek(realizationEnd),
        ).days,
      };
    case 'DAILY':
    default:
      return defaultValue;
  }
};

export const getPeriodRequirements = (frequency: THabitFreq) => {
  return {
    periodLength: getPeriodLength(frequency),
    requiredRealizations: getPeriodRequiredRealizations(frequency),
  };
};

export const extendRealizationData = (
  frequency: THabitFreq,
  realization: THabitRealization[],
  endDate?: string,
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
  const { startOffset, realizationEndOffset } = getPeriodOffsets(
    frequency,
    realization,
  );
  const { periodLength, requiredRealizations } =
    getPeriodRequirements(frequency);
  let periodCount = 0;
  let dayCount = 0;
  let periodStatus: THabitPeriodStatus = 'WAITING';
  let realizationsCount = 0;
  let periodDay = 0;
  while (dayCount < realization.length) {
    let adjustedPeriodLength = periodLength;
    if (periodCount === 0) adjustedPeriodLength = periodLength - startOffset;
    if ((periodCount + 1) * periodLength - startOffset >= realization.length)
      adjustedPeriodLength = adjustedPeriodLength - realizationEndOffset;
    const periodStartIdx = Math.max(
      0,
      periodCount * periodLength - startOffset,
    );
    const periodStart = realization[periodStartIdx].date;
    const periodEndIndex = periodStartIdx + adjustedPeriodLength - 1;
    const periodEnd = getEarlierDate(
      realization[periodEndIndex].date,
      getPeriodEndDate(realization, endDate),
    );

    while (
      dayCount + periodDay < realization.length &&
      periodDay < adjustedPeriodLength
    ) {
      const dayStatus = realization[dayCount + periodDay].dayStatus;
      if (dayStatus === 'DONE') realizationsCount++;
      if (realizationsCount > 0 && realizationsCount < requiredRealizations)
        periodStatus = 'PARTIALLY-DONE';
      if (realizationsCount >= requiredRealizations) periodStatus = 'DONE';
      periodDay++;
      if (
        periodDay === adjustedPeriodLength &&
        !(periodStatus === 'PARTIALLY-DONE' || periodStatus === 'DONE') &&
        realization[dayCount + periodDay - 1].date !==
          getProperDateString(new Date())
      )
        periodStatus = 'NOT-DONE';
    }

    result.push({
      ...realization[dayCount],
      periodStart,
      periodEnd,
      periodStatus,
    });
    if (dayCount === periodEndIndex) {
      periodStatus = 'WAITING';
      realizationsCount = 0;
      periodDay = 0;
      periodCount++;
    }
    dayCount++;
  }
  return result;
};

export const buildHabitGrid = (
  frequency: THabitFreq,
  realization: THabitRealization[],
  startDate: string,
  endDate?: string,
) => {
  const today = new Date();
  const todayTime = today.setHours(0, 0, 0, 0);
  const todayString = getProperDateString(today);

  const properStart =
    todayTime > new Date(startDate).setHours(0, 0, 0, 0) ? startDate : today;
  const properStartTime = new Date(properStart).getTime();
  const gridStart = getFirstDayOfWeek(properStart);

  const realizationEnd = endDate
    ? endDate
    : realization.length > 0
    ? realization[realization.length - 1].date
    : null;
  const properEnd = realizationEnd ? realizationEnd : startDate;
  const properEndTime = new Date(properEnd).getTime();
  const gridEnd = getLastDayOfWeek(properEnd);
  const extendedRealizationData = extendRealizationData(
    frequency,
    realization,
    endDate,
  );

  const grid: IHabitGridDay[][] = [];
  const detaildedData = new Map();
  let weekNumber = 0;
  let dayNumber = 0;
  let day = new Date(gridStart);
  while (day <= gridEnd) {
    if (dayNumber === 0) grid.push([]);
    const dayTime = day.getTime();
    const dayString = getProperDateString(day);
    const isOutOfScope = dayTime < properStartTime || dayTime > properEndTime;
    const realizationData = !isOutOfScope
      ? extendedRealizationData.find((day) => day.date === dayString)
      : undefined;
    const dayObj = {
      ...(realizationData || {}),
      date: dayString,
      isToday: dayString === todayString,
      isStartDate: dayString === startDate,
      isEndDate: dayString === endDate,
      isOutOfScope,
    };
    grid[weekNumber].push(dayObj);
    detaildedData.set(dayString, dayObj);
    if (dayNumber < 6) dayNumber++;
    else {
      weekNumber++;
      dayNumber = 0;
    }
    day = addDays(day, 1);
  }

  return {
    grid,
    detaildedData,
    weekNumber,
    properStart,
    properEnd,
  };
};
