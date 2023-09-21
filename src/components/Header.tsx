import React from 'react';
import styled from 'styled-components';

import { UserPanel } from './index';
import { flexWrappers } from '../styles/mixins';

const StyledHeader = styled.header`
  ${flexWrappers.rLine};
  background-color: ${({ theme }) => theme.color.bg.primary};
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
