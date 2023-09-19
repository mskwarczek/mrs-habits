import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from './index';
import { IGoal } from '../store';

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

const GoalCard = ({ id, name, startDate, endDate, description }: IGoal) => {
  const navigate = useNavigate();

  const handleNav = (endpoint: string) => {
    navigate(endpoint);
  };

  return (
    <StyledCard>
      <p>{name}</p>
      <p>Start: {startDate}</p>
      <p>End: {endDate}</p>
      <p>{description}</p>
      <Button
        text={'Show details'}
        action={() => handleNav(`/goals/${id}`)}
      />
    </StyledCard>
  );
};

export default GoalCard;
