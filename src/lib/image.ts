import PDFJS from '@/config/pdfConfig';

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

export const pdfToImage = async (
  url: string,
  pageNumber: number,
  dpi: number
): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) return reject('File read error');

        const data = Buffer.from(
          (e.target.result as string).replace(/.*base64,/, ''),
          'base64'
        ).toString('binary');

        const canvas = document.createElement('canvas');
        const pdf = await PDFJS.getDocument({ data: data }).promise;
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: dpi / 96 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const render_context = {
          canvasContext: canvas.getContext('2d')!,
          viewport: viewport,
        };

        await page.render(render_context).promise;
        const imgDataUrl = canvas.toDataURL('image/png');

        // Convert dataURL to a File object
        const imgBlob = await (await fetch(imgDataUrl)).blob();
        const imgFile = new File([imgBlob], 'converted-image.png', {
          type: 'image/png',
        });

        resolve(imgFile);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsDataURL(blob);
  });
};

export const blobToFile = (blob: Blob, fileName: string): File => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};
