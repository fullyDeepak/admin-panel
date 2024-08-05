'use client';

import {
  Viewer,
  SpecialZoomLevel,
  Plugin,
  createStore,
  PluginFunctions,
} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import * as PDFJSWorker from 'pdfjs-dist/build/pdf.worker';
import { Rnd } from 'react-rnd';
import { useMemo, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

type PDFViewerProps = {
  content: string | Uint8Array;
  title?: string;
};

interface CustomZoomPlugin extends Plugin {
  zoomTo(_scale: number | SpecialZoomLevel): void;
}
interface StoreProps {
  zoom?(_scale: number | SpecialZoomLevel): void;
}

const customZoomPlugin = (): CustomZoomPlugin => {
  const store = useMemo(() => createStore<StoreProps>({}), []);

  return {
    install: (pluginFunctions: PluginFunctions) => {
      store.update('zoom', pluginFunctions.zoom);
    },
    zoomTo: (scale: number | SpecialZoomLevel) => {
      const zoom = store.get('zoom');
      if (zoom) {
        zoom(scale);
      }
    },
  };
};

export default function PDFViewer({ content, title }: PDFViewerProps) {
  PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const customZoomPluginInstance = customZoomPlugin();
  const { zoomTo } = customZoomPluginInstance;
  zoomTo(SpecialZoomLevel.PageWidth);
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
        <Viewer
          fileUrl={content}
          plugins={[defaultLayoutPluginInstance, customZoomPluginInstance]}
          theme={'dark'}
        />
      </div>
    </Rnd>
  ) : (
    <></>
  );
}
