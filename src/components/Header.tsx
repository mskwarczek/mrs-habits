import React from 'react';
import styled from 'styled-components';

import { UserPanel } from './index';

const StyledHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.color.bg.primary};
  padding-left: ${({ theme }) => theme.space.xl};
  margin-bottom: ${({ theme }) => theme.space.l};
`;

const Header = () => {
  return (
    <StyledHeader>
      <h1>MRS Habits</h1>
      <UserPanel />
    </StyledHeader>
  );
};

export default Header;
