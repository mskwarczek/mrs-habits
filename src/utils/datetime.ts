export const getProperDateString = (date: string | Date) => {
  if (typeof date === 'string') date = new Date(date);
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().substring(0, 10);
};

export const getTimeSinceDate = (date: string | Date) => {
  const today = new Date();
  if (typeof date === 'string') date = new Date(date);
  date.setHours(0, 0, 0, 0);
  const timeDifference = today.getTime() - date.getTime();
  const days = Math.floor(timeDifference / 86400000);
  return {
    days,
  };
};

export const getTimeBetweenDates = (
  start: string | Date,
  end: string | Date,
) => {
  if (typeof start === 'string') start = new Date(start);
  if (typeof end === 'string') end = new Date(end);
  start.setHours(0, 0, 0, 0);
  const timeDifference = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  const days = Math.round(timeDifference / 86400000);
  return {
    days,
  };
};

export const addDays = (date: string | Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getFirstDayOfWeek = (date: string | Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getLastDayOfWeek = (date: string | Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (7 - day) - (day === 0 ? 7 : 0);
  return new Date(d.setDate(diff));
};

export const getEarlierDate = (first: string | Date, second: string | Date) => {
  if (
    new Date(first).setHours(0, 0, 0, 0) < new Date(second).setHours(0, 0, 0, 0)
  )
    return getProperDateString(first);
  return getProperDateString(second);
};

export const getLaterDate = (first: string | Date, second: string | Date) => {
  if (
    new Date(first).setHours(0, 0, 0, 0) > new Date(second).setHours(0, 0, 0, 0)
  )
    return getProperDateString(first);
  return getProperDateString(second);
};
