import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { Field, Textarea, type TextareaProps } from '../core';

export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  fieldClassName?: string;
  textareaClassName?: string;
};

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ className, description, error, fieldClassName, label, textareaClassName, ...props }, ref) => (
    <Field
      className={fieldClassName ?? className}
      description={description}
      error={error}
      label={label}
    >
      <Textarea ref={ref} className={textareaClassName} {...(props as TextareaProps)} />
    </Field>
  ),
);

TextareaField.displayName = 'TextareaField';
