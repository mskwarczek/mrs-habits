import 'styled-components';

interface ISizeValues {
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
};

interface IColorValues {
  primary: string;
  secondary: string;
  action: string;
  active: string;
  error: string;
  warning: string;
  success: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: ISizeValues,
    space: ISizeValues,
    color: {
      text: IColorValues,
      bg: IColorValues,
    },
    fontFamily: string;
    fontSize: ISizeValues,
    fontWeight: {
      normal: string|number;
      bold: string|number;
      action: string|number;
    },
    lineHeight: ISizeValues,
    borderRad: ISizeValues,
  };
};
