import React from 'react';
import { Link } from 'react-router-dom';

import { GoalsOverview, HabitsOverview } from '../components';
import HabitCreator from '../creators/HabitCreator/HabitCreator';

const HomePage = () => {
  return (
    <main>
      Home Page
      <GoalsOverview />
      <Link to='/new-goal'>Create a New Goal</Link>
      <br />
      <HabitsOverview />
      <br />
      <HabitCreator />
    </main>
  );
};

export default HomePage;
