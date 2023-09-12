import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  outline: inherit;
  border: none;
  border-radius: ${({ theme }) => theme.borderRad.s};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.m};
  background-color: ${({ theme }) => theme.color.bg.action};
  color: ${({ theme }) => theme.color.text.action};
  font-weight: ${({ theme }) => theme.fontWeight.action};
  font-size: ${({ theme }) => theme.fontSize.m};
  line-height: ${({ theme }) => theme.lineHeight.m};
`;

interface ISelectProps {
  id: string;
  name?: string;
  value?: string;
  options?: {
    value: string;
    text: string;
  }[];
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  onChange?: (...args: any[]) => void;
}

const Select = ({
  id,
  name,
  value = '',
  options = [],
  disabled,
  required,
  multiple,
  onChange,
}: ISelectProps) => {
  return (
    <StyledSelect
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      required={required}
      multiple={multiple}
      onChange={onChange}
    >
      {options.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
    </StyledSelect>
  );
};

export default Select;
