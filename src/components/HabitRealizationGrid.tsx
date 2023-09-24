import React, { useState } from 'react';
import styled from 'styled-components';

import { GridDay, IGridDay } from './index';
import { IHabit } from '../store';
import { extendRealizationData } from '../store/helpers/habits';
import {
  getProperDateString,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  addDays,
} from '../utils/datetime';
import { transposeMatrix } from '../utils/math';

const StyledGrid = styled.div<{
  orientation: 'VERTICAL' | 'HORIZONTAL';
  $weeksNumber: number;
}>`
  grid-area: realization-grid;
  display: grid;
  ${({ orientation }) =>
    orientation === 'VERTICAL'
      ? 'grid-template-rows'
      : 'grid-template-columns'}: repeat(${({ $weeksNumber }) =>
    $weeksNumber}, 15px);
  ${({ orientation }) =>
    orientation === 'VERTICAL'
      ? 'grid-template-columns'
      : 'grid-template-rows'}: repeat(7, 15px);
  gap: 1px;
  background-color: ${({ theme }) => theme.color.bg.secondary};
  margin-top: ${({ theme }) => theme.space.s};
  margin-bottom: ${({ theme }) => theme.space.s};
  font-size: 10px;
`;

interface IHabitRealizationProps {
  habit: IHabit;
}

const HabitRealizationGrid = ({
  habit: { frequency, startDate, endDate, realization },
}: IHabitRealizationProps) => {
  const [orientation, setOrientation] = useState<'VERTICAL' | 'HORIZONTAL'>(
    'HORIZONTAL',
  );

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
  const extendedRealizationData = extendRealizationData(frequency, realization);

  const grid: IGridDay[][] = [];
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
    if (dayNumber < 6) dayNumber++;
    else {
      weekNumber++;
      dayNumber = 0;
    }
    day = addDays(day, 1);
  }

  return (
    <StyledGrid
      orientation={orientation}
      $weeksNumber={weekNumber}
    >
      {orientation === 'VERTICAL'
        ? grid.map((week) =>
            week.map((day) => (
              <GridDay
                key={day.date}
                day={day}
              />
            )),
          )
        : transposeMatrix(grid).map((week) =>
            week.map((day) => (
              <GridDay
                key={day.date}
                day={day}
              />
            )),
          )}
    </StyledGrid>
  );
};

export default HabitRealizationGrid;
