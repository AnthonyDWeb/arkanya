import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
