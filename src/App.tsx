import React from 'react';
import { ThemeProvider } from 'styled-components';

import Header from './components/Header';
import Router from './routes/Router';
import GlobalStyle from './styles/GlobalStyle';
import defaultTheme from './styles/themes/defaultTheme';

const HabitsApp = () => {
  return (
    <ThemeProvider theme={defaultTheme} >
      <GlobalStyle />
      <Header />
      <Router />
    </ThemeProvider>
  );
};

export default HabitsApp;
