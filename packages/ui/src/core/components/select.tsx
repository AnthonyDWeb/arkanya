import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, options, ...props }, ref) => (
    <select ref={ref} className={cn('ark-select', className)} {...props}>
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  ),
);

Select.displayName = 'Select';
