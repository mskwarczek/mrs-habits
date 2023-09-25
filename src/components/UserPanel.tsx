import React from 'react';
import styled from 'styled-components';
import { redirect, useNavigate } from 'react-router-dom';

import { Button } from './index';
import { flexWrappers } from '../styles/mixins';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  login,
  logout,
} from '../store';

const StyledWrapper = styled.div`
  ${flexWrappers.rLine};
  gap: ${({ theme }) => theme.space.m};
  background-color: ${({ theme }) => theme.color.bg.primary};
`;

const UserPanel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: TRootState) => state.auth);

  const handleLogin = () => {
    dispatch(login()).then(() => redirect('/'));
  };

  const handleLogut = () => {
    dispatch(logout()).then(() => navigate('/guest'));
  };

  const handleNav = (endpoint: string) => {
    navigate(endpoint);
  };

  return (
    <StyledWrapper>
      {user.data?.displayName ? <p>Welcome {user.data.displayName}!</p> : null}
      {user.authenticated ? (
        <Button
          text={'Home'}
          action={() => handleNav('/')}
        />
      ) : null}
      {!user.authenticated ? (
        <Button
          text={'Login'}
          action={handleLogin}
        />
      ) : (
        <Button
          text={'Logout'}
          action={handleLogut}
        />
      )}
      {user.authenticated ? (
        <Button
          text={'Settings'}
          action={() => handleNav('/settings')}
        />
      ) : null}
    </StyledWrapper>
  );
};

export default UserPanel;
