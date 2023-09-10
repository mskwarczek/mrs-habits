import React from 'react';
import { Navigate } from 'react-router-dom';

import { TRootState, useAppSelector } from '../store';

const GuestPage = () => {
  const user = useAppSelector((state: TRootState) => state.auth);

  if (user.authenticated) return <Navigate to={'/'} />;

  return (
    <main>
      Guest Page
    </main>
  );
};

export default GuestPage;
