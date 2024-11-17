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
import { useMemo } from 'react';

type PDFViewerProps =
  | {
      type: 'stringContent';
      content: string | Uint8Array;
      fileContent?: never;
      setPageNumber?: (pageNumber: number) => void;
    }
  | {
      type: 'fileContent';
      content?: never;
      fileContent: File;
      setPageNumber?: (pageNumber: number) => void;
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

export default function PDFViewer({
  content,
  fileContent,
  setPageNumber,
}: PDFViewerProps) {
  if (!content && !fileContent) return <></>;
  PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const customZoomPluginInstance = customZoomPlugin();
  const { zoomTo } = customZoomPluginInstance;
  zoomTo(SpecialZoomLevel.PageWidth);

  const pdfData = useMemo(() => {
    if (fileContent) {
      const objectUrl = URL.createObjectURL(fileContent);
      return objectUrl;
    }
    return '';
  }, [fileContent]);

  return (
    <Viewer
      fileUrl={content || pdfData}
      plugins={[defaultLayoutPluginInstance, customZoomPluginInstance]}
      theme={'dark'}
      onPageChange={(e) => {
        if (setPageNumber) {
          setPageNumber(e.currentPage + 1);
        }
      }}
    />
  );
}
