import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { Header, Footer } from './components';
import Router from './routes/Router';
import GlobalStyle from './styles/GlobalStyle';
import defaultTheme from './styles/themes/defaultTheme';

const ContentWrapper = styled.div`
  min-height: calc(
    100vh -
      (
        ${({ theme }) =>
          '2 * ' +
          theme.space.xs +
          ' + ' +
          theme.space.m +
          ' + ' +
          theme.lineHeight.m}
      )
  );
`;

const HabitsApp = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <ContentWrapper>
        <Header />
        <Router />
      </ContentWrapper>
      <Footer />
    </ThemeProvider>
  );
};

export default HabitsApp;
