import React, { useState, Dispatch } from 'react';
import styled from 'styled-components';

import { GridDay, IGridDay } from './index';
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
  grid: IGridDay[][];
  numberOfWeeks: number;
  selectedDate?: string;
  setSelectedDate: Dispatch<React.SetStateAction<string | undefined>>;
}

const HabitRealizationGrid = ({
  grid,
  numberOfWeeks,
  selectedDate,
  setSelectedDate,
}: IHabitRealizationProps) => {
  const [orientation, setOrientation] = useState<'VERTICAL' | 'HORIZONTAL'>(
    'HORIZONTAL',
  );

  return (
    <StyledGrid
      orientation={orientation}
      $weeksNumber={numberOfWeeks}
    >
      {orientation === 'VERTICAL'
        ? grid.map((week) =>
            week.map((day) => (
              <GridDay
                key={day.date}
                day={day}
                isSelected={selectedDate === day.date}
                setSelectedDate={setSelectedDate}
              />
            )),
          )
        : transposeMatrix(grid).map((week) =>
            week.map((day) => (
              <GridDay
                key={day.date}
                day={day}
                isSelected={selectedDate === day.date}
                setSelectedDate={setSelectedDate}
              />
            )),
          )}
    </StyledGrid>
  );
};

export default HabitRealizationGrid;
