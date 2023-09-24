import React, { Dispatch } from 'react';
import styled from 'styled-components';
import { FaPlay, FaFlagCheckered, FaLocationPin } from 'react-icons/fa6';

import { THabitRealization } from '../store';
import { flexWrappers } from '../styles/mixins';

const StyledGridDay = styled.div<{
  $bgColor: string;
  $isSelected: boolean;
  $isOutOfScope: boolean;
}>`
  ${flexWrappers.rCenter};
  background-color: ${({ $bgColor }) => $bgColor};
  cursor: default;
  color: ${({ theme }) => theme.color.text.primary};
  border: 2px solid
    ${({ theme, $isSelected }) =>
      $isSelected ? theme.color.text.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRad.xs};
  &:hover {
    border: 2px solid
      ${({ theme, $isOutOfScope }) =>
        $isOutOfScope ? 'transparent' : theme.color.text.primary};
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
  isSelected: boolean;
  setSelectedDate: Dispatch<React.SetStateAction<string | undefined>>;
}

const GridDay = ({ day, isSelected, setSelectedDate }: IGridDayProps) => {
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

  const handleSelect = () => {
    if (isOutOfScope) return;
    isSelected ? setSelectedDate(undefined) : setSelectedDate(date);
  };

  let bgColor = 'gray';
  if (isOutOfScope) bgColor = 'transparent';
  if (dayStatus === 'DONE') bgColor = 'green';
  if (dayStatus === 'NOT-DONE') bgColor = 'orange';
  if (dayStatus === 'EMPTY' && periodStatus === 'DONE') bgColor = 'lightgreen';
  if (dayStatus === 'EMPTY' && periodStatus === 'NOT-DONE') bgColor = 'yellow';

  return (
    <StyledGridDay
      $bgColor={bgColor}
      $isSelected={isSelected}
      $isOutOfScope={isOutOfScope}
      title={date}
      onClick={handleSelect}
    >
      {isStartDate && <FaPlay />}
      {isEndDate && <FaFlagCheckered />}
      {isToday && <FaLocationPin />}
    </StyledGridDay>
  );
};

export default GridDay;
