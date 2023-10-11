import React from 'react';
import styled from 'styled-components';

import { Input, Select, Textarea } from './index';
import { flexWrappers } from '../styles/mixins';

const FormWrapper = styled.div`
  ${flexWrappers.cLine};
  align-items: start;
  width: 450px;
`;

const StyledWrapper = styled.div`
  ${flexWrappers.rLine};
  gap: ${({ theme }) => theme.space.xs};
`;

const StyledValidity = styled.p<{ $isValid?: string }>`
  width: 20px;
  color: ${({ theme, $isValid }) =>
    $isValid ? theme.color.text.success : theme.color.text.error};
`;

const DescriptionText = styled.p<{ $isValid?: string }>`
  font-size: ${({ theme }) => theme.fontSize.s};
  padding-top: ${({ theme }) => theme.space.xs};
`;

interface IFormFieldProps {
  id: string;
  name?: string;
  type?: string;
  value?: string;
  options?: {
    value: string;
    text: string;
    disabled?: boolean;
  }[];
  step?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  description?: string;
  label?: string;
  externalIsValid?: boolean;
  onChange?: (...args: any[]) => void;
}

const FormField = ({
  id,
  name,
  type,
  value = '',
  options = [],
  step,
  min,
  max,
  disabled,
  required,
  multiple,
  label,
  description,
  externalIsValid,
  onChange,
}: IFormFieldProps) => {
  const isValid =
    externalIsValid !== undefined
      ? externalIsValid
      : !required || (required && value.length)
      ? true
      : false;

  return (
    <FormWrapper>
      <StyledWrapper>
        <label htmlFor={id}>{label}</label>
        <StyledWrapper>
          {type === 'select' ? (
            <Select
              id={id}
              name={name}
              value={value}
              options={options}
              disabled={disabled}
              required={required}
              multiple={multiple}
              onChange={onChange}
            />
          ) : type === 'textarea' ? (
            <Textarea
              id={id}
              name={name}
              value={value}
              disabled={disabled}
              required={required}
              onChange={onChange}
            />
          ) : (
            <Input
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
          )}
          <StyledValidity $isValid={isValid ? 'true' : undefined}>
            {isValid ? 'OK' : '*'}
          </StyledValidity>
        </StyledWrapper>
      </StyledWrapper>
      <DescriptionText>{description}</DescriptionText>
    </FormWrapper>
  );
};

export default FormField;
