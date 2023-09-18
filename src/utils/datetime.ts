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

export const addDays = (date: string | Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
