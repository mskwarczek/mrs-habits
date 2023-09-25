import React from 'react';
import styled from 'styled-components';

import { CreatorSection, HabitCard } from './index';
import { TRootState, useAppSelector } from '../store';
import { flexWrappers } from '../styles/mixins';

const StyledSectionHeader = styled.div`
  ${flexWrappers.rLine};
  padding-bottom: ${({ theme }) => theme.space.s};
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xs};
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.s}) {
    grid-template-columns: 1fr 1fr;
  }
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.l}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: ${({ theme }) => theme.space.s};
  }
`;

const HabitsOverview = () => {
  const habits = useAppSelector((state: TRootState) => state.habits.data);

  return (
    <section>
      <StyledSectionHeader>
        <h2>Habits summary</h2>
        <CreatorSection type='HABIT' />
      </StyledSectionHeader>
      <StyledWrapper>
        {habits && habits.length ? (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
            />
          ))
        ) : (
          <div>
            <p>You do not have any habits yet. Would you like to add one?</p>
            <br />
            <CreatorSection type='HABIT' />
          </div>
        )}
      </StyledWrapper>
    </section>
  );
};

export default HabitsOverview;
