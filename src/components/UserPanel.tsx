import React from 'react';

import {
  TRootState,
  useAppDispatch,
  useAppSelector,
  login,
  logout,
} from '../store';

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
    <div>
      {user.displayName ? <p>Welcome {user.displayName}</p> : null}
      {!user.uid ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleLogut}>Logout</button>
      )}
    </div>
  );
};

export default UserPanel;
