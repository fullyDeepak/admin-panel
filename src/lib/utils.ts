import { clsx, type ClassValue } from 'clsx';
import { formatISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export const getRandomColor = (num: number) =>
  `hsl(${num * 137.508}deg 80% 75%)`;

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

export function resizeCanvasToSquare(base64Image: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = function () {
      const size = Math.max(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      const offsetX = (size - img.width) / 2;
      const offsetY = (size - img.height) / 2;
      ctx.drawImage(img, offsetX, offsetY, img.width, img.height);
      const newBase64 = canvas.toDataURL();
      resolve(newBase64);
    };
    img.onerror = function () {
      reject(new Error('Image loading failed'));
    };
  });
}
