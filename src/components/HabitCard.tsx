import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, HabitRealizationGrid } from './index';
import { IHabit } from '../store';
import { getTimeSinceDate } from '../utils/datetime';

const StyledCard = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: left;
  width: 300px;
  padding: ${({ theme }) => theme.space.m};
  border: 1px solid ${({ theme }) => theme.color.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRad.m};
`;

interface IHabitCardProps {
  habit: IHabit;
}

const HabitCard = ({ habit }: IHabitCardProps) => {
  const { id, name, startDate, endDate, description } = habit;
  const navigate = useNavigate();

  const handleNav = (endpoint: string) => {
    navigate(endpoint);
  };

  const timePassed = startDate && getTimeSinceDate(startDate);

  return (
    <StyledCard>
      <p>{name}</p>
      {startDate && (
        <p>You have been following this habit since {startDate}.</p>
      )}
      {timePassed && timePassed.days >= 2 && (
        <p>It is {timePassed.days} full days!</p>
      )}
      {endDate && <p>Planned end or update: {endDate}</p>}
      <p>{description}</p>
      <HabitRealizationGrid habit={habit} />
      <Button
        text={'Show details'}
        action={() => handleNav(`/habits/${id}`)}
      />
    </StyledCard>
  );
};

export default HabitCard;
