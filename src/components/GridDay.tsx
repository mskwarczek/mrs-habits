import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaFlagCheckered, FaLocationPin } from 'react-icons/fa6';

import { THabitRealization } from '../store';
import { flexWrappers } from '../styles/mixins';

const StyledGridDay = styled.div<{ bgcolor: string }>`
  ${flexWrappers.rCenter};
  background-color: ${({ bgcolor }) => bgcolor};
  cursor: default;
  color: ${({ theme }) => theme.color.text.primary};
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
      {isStartDate && <FaPlay />}
      {isEndDate && <FaFlagCheckered />}
      {isToday && <FaLocationPin />}
    </StyledGridDay>
  );
};

export default GridDay;
