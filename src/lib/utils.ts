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

export function getRezyColors(num: number) {
  const colors = [
    '#ecaa85',
    '#bcb88a',
    '#b8c294',
    '#d2af9f',
    '#b2beb5',
    '#c7d5da',
    '#9bbac5',
    '#96a8a1',
    '#dc5e33',
    '#a1925f',
    '#8a9a5b',
    '#b1705e',
    '#5b6e61',
    '#9bacb9',
    '#507a8a',
    '#5c7069',
    '#ab3623',
    '#776346',
    '#4d5734',
    '#894c45',
    '#37453c',
    '#708090',
    '#3d5461',
    '#3c4945',
    '#6f281f',
    '#524335',
    '#373e29',
    '#4a2c2a',
    '#262e29',
    '#4e5861',
    '#323e47',
    '#2d3432',
  ];
  if (num < colors.length) {
    return colors[num];
  } else {
    return getRandomColor(num);
  }
}

export function longestCommonPrefix(strings: string[]) {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') {
        return '';
      }
    }
  }

  return prefix;
}
