import React from 'react';
import styled from 'styled-components';

import { flexWrappers } from '../styles/mixins';

const StyledWrapper = styled.div<{ $direction?: 'HORIZONTAL' | 'VERTICAL' }>`
  ${({ $direction }) =>
    $direction === 'VERTICAL' ? flexWrappers.cCenter : flexWrappers.rCenter};
  align-items: stretch;
  div:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRad.m};
    ${({ $direction }) =>
      $direction === 'VERTICAL'
        ? 'border-top-right-radius'
        : 'border-bottom-left-radius'}: ${({ theme }) => theme.borderRad.m};
  }
  div:last-child {
    border: 1px solid ${({ theme }) => theme.color.bg.secondary};
    border-bottom-right-radius: ${({ theme }) => theme.borderRad.m};
    ${({ $direction }) =>
      $direction === 'VERTICAL'
        ? 'border-bottom-left-radius'
        : 'border-top-right-radius'}: ${({ theme }) => theme.borderRad.m};
  }
`;

const StyledGroupButton = styled.div<{
  $isSelected: boolean;
  $direction?: 'HORIZONTAL' | 'VERTICAL';
  $color?: string;
}>`
  ${flexWrappers.rCenter};
  cursor: pointer;
  text-align: center;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.m};
  font-weight: ${({ theme }) => theme.fontWeight.action};
  font-size: ${({ theme }) => theme.fontSize.m};
  line-height: ${({ theme }) => theme.lineHeight.m};
  border: 1px solid ${({ theme }) => theme.color.bg.secondary};
  ${({ $direction }) =>
    $direction === 'VERTICAL' ? 'border-bottom' : 'border-right'}: none;
  background-color: ${({ theme, $isSelected, $color }) =>
    $isSelected ? $color : theme.color.bg.primary};
  color: ${({ theme, $isSelected, $color }) =>
    $color && $isSelected
      ? theme.color.bg.primary
      : $color && !$isSelected
      ? $color
      : $isSelected
      ? theme.color.bg.action
      : theme.color.text.action};
  &:hover {
    background-color: ${({ theme, $color }) =>
      $color ? $color : theme.color.text.action};
    color: ${({ theme, $color }) =>
      $color ? theme.color.bg.primary : theme.color.bg.action};
  }
`;

const StyledTitle = styled.h4`
  padding-bottom: 2px;
`;

interface IButtonGroupProps {
  value: string;
  options: {
    value: string;
    content: React.ReactNode;
    color?: string;
    hidden?: boolean;
  }[];
  title?: string;
  direction?: 'HORIZONTAL' | 'VERTICAL';
  name?: string;
  className?: string;
  onChange: (...args: any[]) => void;
}

const ButtonGroup = ({
  value,
  options,
  title,
  className,
  direction,
  onChange,
}: IButtonGroupProps) => {
  return (
    <>
      {title && <StyledTitle>{title}</StyledTitle>}
      <StyledWrapper
        className={className}
        $direction={direction}
      >
        {options.map(
          (option) =>
            !option.hidden && (
              <StyledGroupButton
                key={option.value}
                $isSelected={option.value === value}
                $direction={direction}
                $color={option.color}
                onClick={() => onChange(option)}
              >
                {option.content}
              </StyledGroupButton>
            ),
        )}
      </StyledWrapper>
    </>
  );
};

export default ButtonGroup;
