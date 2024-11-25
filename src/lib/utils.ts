import { clsx, type ClassValue } from 'clsx';
import { formatISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export const getRandomColor = (num: number, lightness = 75) =>
  `hsl(${num * 137.508}deg 80% ${lightness}%)`;

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export function getCurrentDate() {
  const asiaCurrentDate = formatISO(
    new Date().toLocaleString('en-Us', {
      timeZone: 'Asia/Kolkata',
    }),
    { representation: 'date' }
  );
  return asiaCurrentDate;
}

export const alphaToVal = (s: string) => s.toUpperCase().charCodeAt(0) - 64;
export const valToAlpha = (n: number) => (n + 9).toString(36).toUpperCase();

export function isCharacterALetter(char: string) {
  return /[a-zA-Z]/.test(char);
}
