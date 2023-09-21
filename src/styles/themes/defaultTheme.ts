import { DefaultTheme } from 'styled-components';

const defaultTheme: DefaultTheme = {
  breakpoints: {
    xs: '479px',
    s: '639px',
    m: '769px',
    l: '1025px',
    xl: '1281px',
  },
  space: {
    xs: '10px',
    s: '12px',
    m: '14px',
    l: '18px',
    xl: '22px',
  },
  color: {
    text: {
      primary: '#000000',
      secondary: '#54585C',
      action: '#1E88E5',
      active: '#1E5AE5',
      error: '#FC2828',
      warning: '#FFE524',
      success: '#3AFC28',
    },
    bg: {
      primary: '#FFFFFF',
      secondary: '#E4E6E8',
      action: '#E3F2FD',
      active: '#E3EAFD',
      error: '#F2AEAE',
      warning: '#FAF0A5',
      success: '#BBFFB5',
    },
  },
  fontFamily: 'Roboto, sans-serif',
  fontSize: {
    xs: '8px',
    s: '10px',
    m: '12px',
    l: '14px',
    xl: '16px',
  },
  fontWeight: {
    normal: 400,
    bold: 700,
    action: 500,
  },
  lineHeight: {
    xs: '10px',
    s: '12px',
    m: '14px',
    l: '18px',
    xl: '22px',
  },
  borderRad: {
    xs: '4px',
    s: '8px',
    m: '16px',
    l: '16px',
    xl: '16px',
  },
};

export default defaultTheme;
