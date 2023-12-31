import React from 'react';
import styled from 'styled-components';

import { Input, Select, Textarea } from './index';
import { flexWrappers } from '../styles/mixins';

const StyledWrapper = styled.div`
  ${flexWrappers.rLine};
  padding-bottom: ${({ theme }) => theme.space.xs};
`;

const StyledValidity = styled.p<{ $isValid?: string }>`
  width: 20px;
  padding-left: ${({ theme }) => theme.space.xs};
  color: ${({ theme, $isValid }) =>
    $isValid ? theme.color.text.success : theme.color.text.error};
`;

const DescriptionText = styled.p<{ $isValid?: string }>`
  font-size: ${({ theme }) => theme.fontSize.s};
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
    <div>
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
    </div>
  );
};

export default FormField;
