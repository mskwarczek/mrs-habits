import React from 'react';
import { Navigate } from 'react-router-dom';

import { TRootState, useAppSelector } from '../store';

interface IPrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const user = useAppSelector((state: TRootState) => state.auth);

  return user.authenticated ? <>{children}</> : <Navigate to={'./guest'} />;
};

export default PrivateRoute;
