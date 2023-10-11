import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${({ type }) => (type === 'number' ? '50px' : '300px')};
  outline: inherit;
  border: none;
  border-radius: ${({ theme }) => theme.borderRad.m};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.m};
  background-color: ${({ theme }) => theme.color.bg.action};
  color: ${({ theme }) => theme.color.text.action};
  font-weight: ${({ theme }) => theme.fontWeight.action};
  font-size: ${({ theme }) => theme.fontSize.m};
  line-height: ${({ theme }) => theme.lineHeight.m};
`;

interface IInputProps {
  id: string;
  name?: string;
  type?: string;
  value?: string | number;
  step?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (...args: any[]) => void;
}

const Input = ({
  id,
  name,
  type = 'text',
  value = '',
  step,
  min,
  max,
  disabled,
  required,
  onChange,
}: IInputProps) => {
  return (
    <StyledInput
      id={id}
      name={name}
      type={type}
      value={value}
      step={step}
      min={min}
      max={max}
      disabled={disabled}
      required={required}
      onChange={onChange}
    />
  );
};

export default Input;
