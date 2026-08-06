import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Field, Input, type InputProps } from '../core';

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  fieldClassName?: string;
  inputClassName?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, description, error, fieldClassName, inputClassName, label, ...props }, ref) => (
    <Field
      className={fieldClassName ?? className}
      description={description}
      error={error}
      label={label}
    >
      <Input ref={ref} className={inputClassName} {...(props as InputProps)} />
    </Field>
  ),
);

TextField.displayName = 'TextField';
