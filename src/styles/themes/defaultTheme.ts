import { DefaultTheme } from 'styled-components';

const defaultTheme: DefaultTheme = {
  breakpoints: {
    xs: '321px',
    s: '481px',
    m: '769px',
    l: '1025px',
    xl: '1201px',
  },
  space: {
    xs: '8px',
    s: '16px',
    m: '24px',
    l: '32px',
    xl: '40px',
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
    }
  },
  fontFamily: 'Roboto, sans-serif',
  fontSize: {
    xs: '12px',
    s: '14px',
    m: '16px',
    l: '24px',
    xl: '32px',
  },
  fontWeight: {
    normal: 400,
    bold: 700,
    action: 500,
  },
  lineHeight: {
    xs: '16px',
    s: '20px',
    m: '24px',
    l: '32px',
    xl: '40px',
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
