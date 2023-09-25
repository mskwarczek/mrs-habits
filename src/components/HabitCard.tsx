import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowDownLong, FaArrowRightLong } from 'react-icons/fa6';

import { IGridDay, Button, Image, HabitRealizationGrid } from './index';
import { IHabit } from '../store';
import {
  extendRealizationData,
  getReadableStatus,
} from '../store/helpers/habits';
import {
  getProperDateString,
  getTimeSinceDate,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  addDays,
} from '../utils/datetime';
import { flexWrappers } from '../styles/mixins';

const StyledCard = styled.div<{ $selectedDate?: string }>`
  display: grid;
  grid-template-areas: ${({ $selectedDate }) =>
    $selectedDate
      ? `'icon name'
    'info info'
    'selected-date selected-date'
    'realization-grid realization-grid'
    '. expand-button'`
      : `'icon name'
    'info info'
    'realization-grid realization-grid'
    '. expand-button'`};
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

const StyledSelectedDate = styled.div`
  grid-area: selected-date;
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

  const handleNav = (endpoint: string) => {
    navigate(endpoint);
  };

  const timePassed = startDate && getTimeSinceDate(startDate);

  const { grid, detaildedData, weekNumber, properStart, properEnd } =
    useMemo(() => {
      const today = new Date();
      const todayTime = today.setHours(0, 0, 0, 0);
      const todayString = getProperDateString(today);

      const properStart =
        todayTime > new Date(startDate).setHours(0, 0, 0, 0)
          ? startDate
          : today;
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
      );

      const grid: IGridDay[][] = [];
      const detaildedData = new Map();
      let weekNumber = 0;
      let dayNumber = 0;
      let day = new Date(gridStart);
      while (day <= gridEnd) {
        if (dayNumber === 0) grid.push([]);
        const dayTime = day.getTime();
        const dayString = getProperDateString(day);
        const isOutOfScope =
          dayTime < properStartTime || dayTime > properEndTime;
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
    }, [startDate, endDate, frequency, realization]);

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
        {startDate && (
          <p>You have been following this habit since {startDate}.</p>
        )}
        {timePassed && timePassed.days >= 2 && (
          <p>It is {timePassed.days} full days!</p>
        )}
        {endDate && <p>Planned end or update: {endDate}</p>}
        <p>{description}</p>
      </StyledInfo>
      {selectedDate && (
        <StyledSelectedDate>
          <p>Selected date: {selectedDate}</p>
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
