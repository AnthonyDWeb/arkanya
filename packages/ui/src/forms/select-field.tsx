import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Field, Select, type SelectOption, type SelectProps } from '../core';

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  fieldClassName?: string;
  options?: SelectOption[];
  selectClassName?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      children,
      className,
      description,
      error,
      fieldClassName,
      label,
      options,
      selectClassName,
      ...props
    },
    ref,
  ) => (
    <Field
      className={fieldClassName ?? className}
      description={description}
      error={error}
      label={label}
    >
      <Select ref={ref} className={selectClassName} options={options} {...(props as SelectProps)}>
        {children}
      </Select>
    </Field>
  ),
);

SelectField.displayName = 'SelectField';
