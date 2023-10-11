import React, { Dispatch } from 'react';
import styled from 'styled-components';
import { FaPlay, FaFlagCheckered, FaLocationPin } from 'react-icons/fa6';

import type { IHabitGridDay } from '../types';
import { getStatusColor } from '../features/habits/habits';
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

interface IGridDayProps {
  day: IHabitGridDay;
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

  const bgColor = isOutOfScope
    ? 'transparent'
    : getStatusColor(dayStatus, periodStatus);

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
