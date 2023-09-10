import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.space.xs};
`;

const StyledInput = styled.input`
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

const StyledValidity = styled.p<{ isvalid?: string }>`
  width: 20px;
  padding-left: ${({ theme }) => theme.space.xs};
  color: ${({ theme, isvalid }) =>
    isvalid ? theme.color.text.success : theme.color.text.error};
`;

interface IInputProps {
  id: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  onChange?: (...args: any[]) => void;
}

const Input = ({
  id,
  type = 'text',
  value = '',
  disabled,
  required,
  label,
  onChange,
}: IInputProps) => {
  const isValid = !required || (required && value) ? true : false;

  if (type === 'textarea')
    return (
      <StyledWrapper>
        <label htmlFor={id}>{label}</label>
        <StyledWrapper>
          <StyledTextarea
            id={id}
            value={value}
            disabled={disabled}
            required={required}
            onChange={onChange}
          />
          <StyledValidity isvalid={isValid ? 'true' : undefined}>
            {isValid ? 'OK' : '*'}
          </StyledValidity>
        </StyledWrapper>
      </StyledWrapper>
    );

  return (
    <StyledWrapper>
      <label htmlFor={id}>{label}</label>
      <StyledWrapper>
        <StyledInput
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
        />
        <StyledValidity isvalid={isValid ? 'true' : undefined}>
          {isValid ? 'OK' : '*'}
        </StyledValidity>
      </StyledWrapper>
    </StyledWrapper>
  );
};

export default Input;
