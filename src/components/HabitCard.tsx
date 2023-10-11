import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowDownLong, FaArrowRightLong } from 'react-icons/fa6';

import type { IHabit, THabitDayStatus } from '../types';
import {
  Button,
  ButtonGroup,
  Image,
  HabitRealizationGrid,
} from './index';
import {
  useAppDispatch,
  editHabitRealization,
} from '../store';
import {
  getReadableStatus,
  getStatusColor,
  buildHabitGrid,
} from '../features/habits';
import {
  getProperDateString,
  getTimeSinceDate,
} from '../utils/datetime';
import { flexWrappers } from '../styles/mixins';

const StyledCard = styled.div<{ $selectedDate?: string }>`
  display: grid;
  grid-template-columns: 50px 1fr 1fr;
  grid-template-rows: ${({ $selectedDate }) =>
    $selectedDate ? 'repeat(6, auto) 34px' : 'repeat(4, auto) 34px'};
  grid-template-areas: ${({ $selectedDate }) =>
    $selectedDate
      ? `'icon name name'
    'icon info info'
    'description description description'
    'selected-date selected-date selected-date'
    'day-status-change day-status-change day-status-change'
    'realization-grid realization-grid realization-grid'
    '. . expand-button'`
      : `'icon name name'
    'icon info info'
    'description description description'
    'realization-grid realization-grid realization-grid'
    '. . expand-button'`};
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.xs};
  border: 1px solid ${({ theme }) => theme.color.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRad.m};
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.space.s};
  }
`;

const StyledImageWrapper = styled.div`
  grid-area: icon;
`;

const StyledName = styled.h3`
  grid-area: name;
`;

const StyledInfo = styled.div`
  grid-area: info;
`;

const StyledDescription = styled.div`
  grid-area: description;
`;

const StyledSelectedDate = styled.div`
  grid-area: selected-date;
`;

const StyledButtonsContainer = styled.div`
  grid-area: day-status-change;
  ${flexWrappers.cCenter};
`;

const StyledGridWrapper = styled.div`
  grid-area: realization-grid;
`;

const StyledButton = styled(Button)`
  grid-area: expand-button;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

const StyledWeeksAxis = styled.div`
  ${flexWrappers.rCenter};
  & p {
    font-size: ${({ theme }) => theme.fontSize.s};
    line-height: ${({ theme }) => theme.lineHeight.s};
    padding-left: ${({ theme }) => theme.space.m};
    padding-right: ${({ theme }) => theme.space.m};
  }
`;

const StyledWDaysAxis = styled.div`
  ${flexWrappers.cLine};
  padding-right: 2px;
  & p {
    font-size: ${({ theme }) => theme.fontSize.s};
    line-height: ${({ theme }) => theme.lineHeight.s};
  }
`;

interface IHabitCardProps {
  habit: IHabit;
}

const HabitCard = ({ habit }: IHabitCardProps) => {
  const { id, name, startDate, endDate, description, frequency, realization } =
    habit;

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();

  const handleNav = (endpoint: string) => {
    navigate(endpoint);
  };

  const handleEditDayState = (value: THabitDayStatus) => {
    if (!selectedDate) return;
    appDispatch(
      editHabitRealization({
        habitId: id,
        date: selectedDate,
        values: {
          dayStatus: value,
        },
      }),
    );
  };

  const timeSinceStart = startDate && getTimeSinceDate(startDate);
  const timeSinceEnd = endDate && getTimeSinceDate(endDate);

  const { grid, detaildedData, weekNumber, properStart, properEnd } =
    useMemo(() => buildHabitGrid(frequency, realization, startDate, endDate), 
      [startDate, endDate, frequency, realization]);

  const selectedDayData = selectedDate
    ? detaildedData.get(selectedDate)
    : undefined;

  return (
    <StyledCard $selectedDate={selectedDate}>
      <StyledImageWrapper>
        <Image
          path={'icons/icon_001.png'}
          width={'50px'}
          height={'50px'}
          alt={'Habit icon'}
        />
      </StyledImageWrapper>
      <StyledName>{name}</StyledName>
      <StyledInfo>
        {timeSinceStart && timeSinceStart.days >= 0 ? (
          <p>
            Performed since {startDate} {'('}
            {timeSinceStart.days} days{')'}.
          </p>
        ) : (
          <p>Starts on {startDate}.</p>
        )}
        {timeSinceEnd && timeSinceEnd.days <= 0 && (
          <p>Finishes on {endDate}.</p>
        )}
        {timeSinceEnd && timeSinceEnd.days > 0 && <p>Finished on {endDate}.</p>}
      </StyledInfo>
      <StyledDescription>
        {description && <p>Description: {description}</p>}
      </StyledDescription>
      {selectedDate && (
        <StyledSelectedDate>
          <h4>Selected date: {selectedDate}</h4>
          {selectedDayData.dayStatus && (
            <p>Day status: {getReadableStatus(selectedDayData.dayStatus)}</p>
          )}
          {frequency.type !== 'DAILY' && selectedDayData.periodStart && (
            <p>
              Period: {selectedDayData.periodStart} -{' '}
              {selectedDayData.periodEnd}
            </p>
          )}
          {frequency.type !== 'DAILY' && selectedDayData.periodStatus && (
            <p>
              Period status: {getReadableStatus(selectedDayData.periodStatus)}
            </p>
          )}
        </StyledSelectedDate>
      )}
      {selectedDate && selectedDayData && selectedDayData.dayStatus && (
        <StyledButtonsContainer>
          <ButtonGroup
            value={selectedDayData.dayStatus}
            title={'Change day status'}
            onChange={handleEditDayState}
            options={[
              {
                value: 'NOT-DONE',
                content: getReadableStatus('NOT-DONE'),
                color: getStatusColor('NOT-DONE'),
              },
              {
                value: 'EMPTY',
                content: getReadableStatus('EMPTY'),
                color: getStatusColor('EMPTY'),
                hidden: frequency.type === 'DAILY' && !selectedDayData.isToday,
              },
              {
                value: 'DONE',
                content: getReadableStatus('DONE'),
                color: getStatusColor('DONE'),
              },
            ]}
          />
        </StyledButtonsContainer>
      )}
      <StyledGridWrapper>
        <StyledWeeksAxis>
          <p>{getProperDateString(properStart)}</p>
          <FaArrowRightLong />
          <p>{getProperDateString(properEnd)}</p>
        </StyledWeeksAxis>
        <StyledContainer>
          <StyledWDaysAxis>
            <p>Mon</p>
            <FaArrowDownLong />
            <p>Sun</p>
          </StyledWDaysAxis>
          <HabitRealizationGrid
            grid={grid}
            numberOfWeeks={weekNumber}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </StyledContainer>
      </StyledGridWrapper>
      <StyledButton
        text={'Show details'}
        action={() => handleNav(`/habits/${id}`)}
      />
    </StyledCard>
  );
};

export default HabitCard;
