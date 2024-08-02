import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getRandomColor = (num: number) =>
  `hsl(${num * 137.508}deg 80% 75%)`;

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
