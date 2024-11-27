'use client';

import {
  Viewer,
  SpecialZoomLevel,
  Plugin,
  createStore,
  PluginFunctions,
  PageChangeEvent,
  Worker,
} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useEffect, useMemo, useState } from 'react';
import PDFJS from '@/config/pdfConfig';

type PDFViewerProps =
  | {
      type: 'stringContent';
      content: string | Uint8Array;
      fileContent?: never;
      pageNumber?: number;
      setPageNumber?: (pageNumber: number) => void;
      zoom?: number;
    }
  | {
      type: 'fileContent';
      content?: never;
      fileContent: File;
      pageNumber?: number;
      setPageNumber?: (pageNumber: number) => void;
      zoom?: number;
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
  pageNumber,
  setPageNumber,
  zoom,
}: PDFViewerProps) {
  if (!content && !fileContent) return <></>;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const customZoomPluginInstance = customZoomPlugin();
  const { zoomTo } = customZoomPluginInstance;
  zoomTo(zoom || 0.5);
  const [page, setPage] = useState(pageNumber || 1);

  const pdfData = useMemo(() => {
    if (fileContent) {
      const objectUrl = URL.createObjectURL(fileContent);
      return objectUrl;
    }
    return '';
  }, [fileContent]);

  function onPageChange(e: PageChangeEvent) {
    if (e.currentPage !== 0) {
      setPage(e.currentPage + 1);
    }
  }

  useEffect(() => {
    if (page !== 0 && pageNumber !== page && setPageNumber) {
      setPageNumber(page);
    }
  }, [page]);

  return (
    <Worker workerUrl={PDFJS}>
      <Viewer
        fileUrl={content || pdfData}
        plugins={[defaultLayoutPluginInstance, customZoomPluginInstance]}
        theme={'dark'}
        initialPage={page - 1}
        onPageChange={onPageChange}
      />
    </Worker>
  );
}
