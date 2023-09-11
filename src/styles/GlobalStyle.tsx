import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    padding: ${({ theme }) => theme.space.xs};
    background-color: ${({ theme }) => theme.color.bg.primary};
    color: ${({ theme }) => theme.color.text.primary};
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: ${({ theme }) => theme.fontSize.m};
    font-weight: ${({ theme }) => theme.fontWeight.normal};
  }

  a {
    color: ${({ theme }) => theme.color.text.primary};
    text-decoration: none;
  }

  button {
    color: ${({ theme }) => theme.color.text.primary};
    background-color: ${({ theme }) => theme.color.bg.primary};
    cursor: pointer;
    outline: inherit;
    border: none;
  }
`;

export default GlobalStyle;
