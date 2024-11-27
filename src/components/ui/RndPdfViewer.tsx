'use client';

import { Rnd } from 'react-rnd';
import { useState } from 'react';
import { VscClose } from 'react-icons/vsc';
import PDFViewer from './PdfViewer';

type RndPdfViewerProps = {
  content: string | Uint8Array;
  title?: string;
};

export default function RndPdfViewer({ content, title }: RndPdfViewerProps) {
  const [hide, setHide] = useState<boolean>(false);

  return !hide ? (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 900,
        height: 600,
      }}
      className='relative z-30 !cursor-default rounded-xl bg-base-300 pt-10 shadow-c'
      cancel='.cancel'
    >
      <span
        className='cancel absolute right-0 top-0 flex h-10 w-10 cursor-default items-center justify-between rounded-tr-xl text-center hover:bg-red-500 hover:text-white'
        title='Close'
        onClick={() => setHide(true)}
      >
        <VscClose size={30} className='pl-2' />
      </span>
      <span className='absolute top-2 mx-auto pl-4'>{title}</span>
      <div className='cancel h-full w-full'>
        <PDFViewer content={content} type='stringContent' zoom={1} />
      </div>
    </Rnd>
  ) : (
    <></>
  );
}
