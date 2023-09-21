import React from 'react';
import styled from 'styled-components';

import { flexWrappers } from '../styles/mixins';

const StyledButton = styled.button`
  ${flexWrappers.rCenter};
  cursor: pointer;
  outline: inherit;
  border: none;
  border-radius: ${({ theme }) => theme.borderRad.s};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.m};
  background-color: ${({ theme }) => theme.color.bg.action};
  color: ${({ theme }) => theme.color.text.action};
  font-weight: ${({ theme }) => theme.fontWeight.action};
  font-size: ${({ theme }) => theme.fontSize.m};
  line-height: ${({ theme }) => theme.lineHeight.m};
  &:hover {
    background-color: ${({ theme }) => theme.color.text.action};
    color: ${({ theme }) => theme.color.bg.action};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.color.bg.secondary};
    color: ${({ theme }) => theme.color.text.primary};
  }
`;

interface IButtonProps {
  text: string;
  disabled?: boolean;
  title?: string;
  action?: (...args: any[]) => void;
}

const Button = ({ text, disabled, title, action }: IButtonProps) => {
  return (
    <StyledButton
      onClick={action && !disabled ? () => action() : () => null}
      disabled={disabled}
      title={title}
    >
      {text}
    </StyledButton>
  );
};

export default Button;
