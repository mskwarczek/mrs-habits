import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main>
      Home Page
      <Link to='/new-goal'>Create a New Goal</Link>
    </main>
  );
};

export default HomePage;
