import React from 'react';
import styled from 'styled-components';

import { THabitRealization } from '../store';

const StyledGridDay = styled.div<{ bgcolor: string }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgcolor }) => bgcolor};
  cursor: default;
  &:hover {
    border: 1px solid ${({ theme }) => theme.color.bg.active};
  }
`;

export interface IGridDay extends Partial<THabitRealization> {
  date: string;
  periodStart?: string;
  periodEnd?: string;
  periodStatus?: string;
  isToday: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
  isOutOfScope: boolean;
}

interface IGridDayProps {
  day: IGridDay;
}

const GridDay = ({ day }: IGridDayProps) => {
  const {
    date,
    dayStatus,
    periodStatus,
    note,
    isToday,
    isStartDate,
    isEndDate,
    isOutOfScope,
  } = day;

  let bgColor = 'gray';
  if (isOutOfScope) bgColor = 'transparent';
  if (dayStatus === 'DONE') bgColor = 'green';
  if (dayStatus === 'NOT-DONE') bgColor = 'orange';
  if (dayStatus === 'EMPTY' && periodStatus === 'DONE') bgColor = 'lightgreen';
  if (dayStatus === 'EMPTY' && periodStatus === 'NOT-DONE') bgColor = 'yellow';

  return (
    <StyledGridDay
      bgcolor={bgColor}
      title={date}
    >
      {isStartDate && '>'}
      {isEndDate && '<'}
      {isToday && '*'}
    </StyledGridDay>
  );
};

export default GridDay;
