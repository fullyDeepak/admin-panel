'use client';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import * as PDFJSWorker from 'pdfjs-dist/build/pdf.worker';
import { ChangeEvent, useState } from 'react';
import { Buffer } from 'buffer';
import Preview from './Preview';
import LoadingCircle from '@/components/ui/LoadingCircle';
import ImageCropper from '@/components/ui/ImageCropper';

export default function Page() {
  PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [dpi, setDpi] = useState(200);
  const [showEditor, setShowEditor] = useState(true);

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFile = e.target.files[0];
    if (newFile && newFile.type === 'application/pdf') {
      setFile(newFile);
    }
  };

  const UrlUploader = (url: string) => {
    setImageFile([]);
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target?.result) return;
          const data = Buffer.from(
            (e.target.result as string).replace(/.*base64,/, ''),
            'base64'
          ).toString('binary');
          renderPage(data, pageNumber);
        };
        reader.readAsDataURL(blob);
      });
    });
  };

  const renderPage = async (data: string, pageNumber?: number) => {
    setLoading(true);
    const imagesList: File[] = [];
    const canvas = document.createElement('canvas');
    canvas.setAttribute('className', 'canv');
    const pdf = await PDFJS.getDocument({ data }).promise;
    if (!pdf.numPages) return;
    if (pageNumber) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: dpi / 96 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const render_context = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      };
      await page.render(render_context).promise;
      const img = canvas.toDataURL('image/png');
      const response = await fetch(img);
      const blob = await response.blob();
      const imgFile = new File([blob], 'converted-image.png', {
        type: 'image/png',
      });
      imagesList.push(imgFile);
    } else {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: dpi / 96 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const render_context = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport,
        };
        await page.render(render_context).promise;
        const img = canvas.toDataURL('image/png');
        const response = await fetch(img);
        const blob = await response.blob();
        const imgFile = new File([blob], 'converted-image.png', {
          type: 'image/png',
        });
        imagesList.push(imgFile);
      }
    }
    setImageFile((e: any) => [...e, ...imagesList]);
    setLoading(false);
  };

  const pdfToImage = async (file: File) => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('className', 'canv');
    const pdf = await PDFJS.getDocument({ data: file }).promise;
    if (!pdf.numPages) return;
    if (pageNumber) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: dpi / 96 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const render_context = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      };
      await page.render(render_context).promise;
      const img = canvas.toDataURL('image/png');
      setImageFile((e: any) => [...e, img]);
    } else {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: dpi / 96 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const render_context = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport,
        };
        await page.render(render_context).promise;
        const img = canvas.toDataURL('image/png');
        setImageFile((e: any) => [...e, img]);
      }
    }
  };

  return (
    <div className='mx-auto my-10 flex w-[60%] flex-col'>
      <div className='mx-auto flex items-center gap-5'>
        <input
          type='file'
          accept='.pdf'
          onChange={onFileDrop}
          className='file-input file-input-bordered file-input-accent file-input-sm h-10 w-96'
        />
        <input
          type='number'
          value={dpi || ''}
          min={1}
          onChange={(e) => setDpi(e.target.valueAsNumber)}
          placeholder='DPI'
          className={
            'w-32 rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
          }
        />
        <button
          className='btn btn-neutral btn-sm h-10'
          onClick={() => {
            if (!file) return;
            UrlUploader(URL.createObjectURL(file));
          }}
        >
          Convert
        </button>
        {/* <button
          className='btn btn-neutral btn-sm h-10'
          onClick={() => setShowEditor(true)}
        >
          Open Image Editor
        </button> */}
      </div>

      {loading && (
        <LoadingCircle
          circleColor='violet'
          size='large'
          tailwindClass='mx-auto mt-10'
        />
      )}

      {/* {showEditor && imageFile.length > 0 && (
        <ImageEditor
          source={imageFile[0]}
          showEditor={showEditor}
          setShowEditor={setShowEditor}
        />
      )} */}

      {showEditor && imageFile.length > 0 && (
        <ImageCropper src={imageFile[0]} />
      )}

      <div className='mt-10'>
        {file && <Preview file={file} setPageNumber={setPageNumber} />}
        <div id='image-container'>
          {imageFile.map((file, index) => (
            <div key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={`Page ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
