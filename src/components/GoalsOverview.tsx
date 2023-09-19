import React from 'react';
import styled from 'styled-components';

import { GoalCard } from './index';
import { TRootState, useAppSelector } from '../store';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  width: 1200px;
  gap: ${({ theme }) => theme.space.m};
`;

const GoalsOverview = () => {
  const goals = useAppSelector((state: TRootState) => state.goals.data);

  return (
    <div>
      Your goals:
      <StyledWrapper>
        {goals ? (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.name}
              startDate={goal.startDate}
              endDate={goal.endDate}
              description={goal.description}
            />
          ))
        ) : (
          <div>You do not have any goals yet. Would you like to add one?</div>
        )}
      </StyledWrapper>
    </div>
  );
};

export default GoalsOverview;
