import React from 'react';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
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

interface IInputProps {
  id: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (...args: any[]) => void;
}

const Textarea = ({
  id,
  name,
  value = '',
  disabled,
  required,
  onChange,
}: IInputProps) => {

  return (
    <StyledTextarea
      id={id}
      name={name}
      value={value}
      disabled={disabled}
      required={required}
      onChange={onChange}
    />
  );
};

export default Textarea;
