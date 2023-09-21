import { css } from 'styled-components';

export const flexWrappers = {
  rCenter: () => css`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  `,
  cCenter: () => css`
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  `,
  rLine: () => css`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
  `,
  cLine: () => css`
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
  `,
};
