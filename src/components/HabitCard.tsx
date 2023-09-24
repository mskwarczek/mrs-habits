import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Image, HabitRealizationGrid } from './index';
import { IHabit } from '../store';
import { getTimeSinceDate } from '../utils/datetime';

const StyledCard = styled.div`
  display: grid;
  grid-template-areas:
    'icon name'
    'info info'
    'realization-grid realization-grid'
    '. expand-button';
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.xs};
  border: 1px solid ${({ theme }) => theme.color.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRad.m};
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: ${({ theme }) => theme.space.s};
  }
`;

const StyledIconContainer = styled.div`
  grid-area: icon;
`;

const StyledName = styled.h3`
  grid-area: name;
`;

const StyledInfo = styled.div`
  grid-area: info;
`;

const StyledButton = styled(Button)`
  grid-area: expand-button;
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
      <StyledIconContainer>
        <Image
          path='icons/icon_001.png'
          width={'50px'}
          height={'50px'}
          alt={'Habit icon'}
        />
      </StyledIconContainer>
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
      <HabitRealizationGrid habit={habit} />
      <StyledButton
        text={'Show details'}
        action={() => handleNav(`/habits/${id}`)}
      />
    </StyledCard>
  );
};

export default HabitCard;
