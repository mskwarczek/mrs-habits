import React from 'react';

import { CreatorSection, HabitsOverview } from '../components';

const HomePage = () => {
  return (
    <main>
      Home Page
      <br />
      <HabitsOverview />
      <br />
      <CreatorSection type='HABIT' />
    </main>
  );
};

export default HomePage;
