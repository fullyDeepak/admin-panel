'use client';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import * as PDFJSWorker from 'pdfjs-dist/build/pdf.worker';
import { ChangeEvent, useMemo, useState } from 'react';
import { Buffer } from 'buffer';
import Preview from './Preview';
import LoadingCircle from '@/components/ui/LoadingCircle';
import dynamic from 'next/dynamic';

export default function Page() {
  PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
  const [file, setFile] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [dpi, setDpi] = useState(200);
  const [showEditor, setShowEditor] = useState(false);

  const ImageEditor = useMemo(
    () =>
      dynamic(() => import('../../components/ui/ImageEditor'), {
        ssr: false,
      }),
    []
  );
  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFile = e.target.files[0];
    if (newFile && newFile.type === 'application/pdf') {
      setFile(newFile);
    }
  };

  const UrlUploader = (url: string) => {
    setImageUrls([]);
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
    const imagesList: string[] = [];
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
      imagesList.push(img);
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
        imagesList.push(img);
      }
    }
    setImageUrls((e: any) => [...e, ...imagesList]);
    setLoading(false);
    setTimeout(() => {
      document.getElementById('image-container')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
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
          value={pageNumber || ''}
          min={1}
          onChange={(e) => setPageNumber(e.target.valueAsNumber)}
          placeholder='Page Number'
          className={
            'w-32 rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
          }
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
        <button
          className='btn btn-neutral btn-sm h-10'
          onClick={() => setShowEditor(true)}
        >
          Open Image Editor
        </button>
      </div>

      {loading && (
        <LoadingCircle
          circleColor='violet'
          size='large'
          tailwindClass='mx-auto mt-10'
        />
      )}

      {showEditor && imageUrls.length > 0 && (
        <ImageEditor
          source={imageUrls[0]}
          showEditor={showEditor}
          setShowEditor={setShowEditor}
        />
      )}

      <div className='mt-10'>
        {file && <Preview file={file} />}
        <div id='image-container'>
          {imageUrls.map((url, index) => (
            <div key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
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
