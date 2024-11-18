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
import { useMemo } from 'react';

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

type Props = {
  file: File;
  setPageNumber: (_pageNumber: number) => void;
};

function Preview({ file, setPageNumber }: Props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const customZoomPluginInstance = customZoomPlugin();
  const pdf = useMemo(() => URL.createObjectURL(file), [file]);
  return (
    <div className='h-[60vh] w-full'>
      <Viewer
        fileUrl={pdf}
        plugins={[defaultLayoutPluginInstance, customZoomPluginInstance]}
        theme={'dark'}
        onPageChange={(e) => setPageNumber(e.currentPage + 1)}
      />
    </div>
  );
}

export default Preview;
