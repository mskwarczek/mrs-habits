import React from 'react';
import styled from 'styled-components';

import { HabitCard } from './index';
import { TRootState, useAppSelector } from '../store';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  width: 1200px;
  gap: ${({ theme }) => theme.space.m};
`;

const HabitsOverview = () => {
  const habits = useAppSelector((state: TRootState) => state.habits.data);

  return (
    <div>
      Your habits:
      <StyledWrapper>
        {habits ? (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
            />
          ))
        ) : (
          <div>You do not have any habits yet. Would you like to add one?</div>
        )}
      </StyledWrapper>
    </div>
  );
};

export default HabitsOverview;
