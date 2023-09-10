import React from 'react';
import styled from 'styled-components';

import Button from './Button';
import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  login,
  logout,
} from '../store';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space.m};
  background-color: ${({ theme }) => theme.color.bg.primary};
`;

const UserPanel = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: TRootState) => state.auth);

  const handleLogin = () => {
    dispatch(login());
  };

  const handleLogut = () => {
    dispatch(logout());
  };

  return (
    <StyledWrapper>
      {user.displayName ? <p>Welcome {user.displayName}!</p> : null}
      {!user.uid ? (
        <Button text={'Login'} action={handleLogin} />
      ) : (
        <Button text={'Logout'} action={handleLogut} />
      )}
      {user.uid ? (
        <Button text={'Settings'} action={() => null} />
      ) : null}
    </StyledWrapper>
  );
};

export default UserPanel;
