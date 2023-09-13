import React from 'react';
import { Link } from 'react-router-dom';

import { GoalsOverview } from '../components';
import HabitCreator from '../creators/HabitCreator/HabitCreator';

const HomePage = () => {
  return (
    <main>
      Home Page
      <GoalsOverview />
      <Link to='/new-goal'>Create a New Goal</Link>
      <br />
      <br />
      <HabitCreator />
    </main>
  );
};

export default HomePage;
