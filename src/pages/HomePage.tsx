import React from 'react';
import { Link } from 'react-router-dom';

import { GoalsOverview } from '../components';

const HomePage = () => {
  return (
    <main>
      Home Page
      <GoalsOverview />
      <Link to='/new-goal'>Create a New Goal</Link>
    </main>
  );
};

export default HomePage;
