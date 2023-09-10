import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage, GuestPage, SettingsPage} from '../pages';
import PrivateRoute from './PrivateRoute';

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path='/settings' element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      <Route path='/guest' element={<GuestPage />} />
    </Routes>
  );
};

export default Router;
