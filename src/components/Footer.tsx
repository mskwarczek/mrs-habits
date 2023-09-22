import React from 'react';
import styled from 'styled-components';

import { flexWrappers } from '../styles/mixins';

const StyledFooter = styled.footer`
  ${flexWrappers.cLine};
  background-color: ${({ theme }) => theme.color.bg.primary};
  margin-top: ${({ theme }) => theme.space.m};
`;

const ExternalLink = styled.a`
  &:hover {
    color: ${({ theme }) => theme.color.text.action};
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div>
        <ExternalLink
          href='https://www.flaticon.com/'
          title='Flat Icons - Flaticon'
        >
          Icons created by Flat Icons - Flaticon
        </ExternalLink>
      </div>
    </StyledFooter>
  );
};

export default Footer;
