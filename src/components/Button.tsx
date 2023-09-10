import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
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
`;

interface IButtonProps {
  text: string;
  disabled?: boolean;
  action?: (...args: any[]) => void;
};

const Button = ({ text, disabled, action }: IButtonProps) => {
  return (
    <StyledButton onClick={action && !disabled ? () => action() : () => null} disabled={disabled}>
      {text}
    </StyledButton>
  );
};

export default Button;
