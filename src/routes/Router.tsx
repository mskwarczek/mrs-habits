import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage, GuestPage, NewGoalPage, SettingsPage } from '../pages';
import PrivateRoute from './PrivateRoute';

const Router = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path='/new-goal'
        element={
          <PrivateRoute>
            <NewGoalPage />
          </PrivateRoute>
        }
      />
      {/* <Route path='/new-goal' element={<NewGoalPage />} /> */}
      <Route
        path='/settings'
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/guest'
        element={<GuestPage />}
      />
    </Routes>
  );
};

export default Router;
