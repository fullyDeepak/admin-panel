import React, { memo, useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { resizeCanvasToSquare } from '@/lib/utils';

type Props = {
  src: File;
  saveBlob?: (data: Blob | null) => void;
};

function ImageCropper({ src, saveBlob }: Props) {
  const [sourceFile, setSourceFile] = useState<File>(src);
  const [source, setSource] = useState<string>(URL.createObjectURL(src));
  const [showOptions, setShowOptions] = React.useState(false);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  // link.href = await resizeCanvasToSquare(
  //   cropper?.getCroppedCanvas().toDataURL()
  // );

  async function onCropEnd() {
    const cropper = cropperRef.current?.cropper;
    if (cropper?.getCroppedCanvas().toDataURL() == null) return;
    const response = await fetch(
      await resizeCanvasToSquare(cropper?.getCroppedCanvas().toDataURL())
    );
    const blob = await response.blob();
    setBlob(blob);
    if (saveBlob) {
      saveBlob(blob);
    }
    setShowOptions(true);
  }

  const downloadBlob = async () => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (sourceFile.size !== src.size) {
      setSourceFile(src);
      setSource(URL.createObjectURL(src));
    }
  }, [src]);

  return (
    <div className='relative mt-5'>
      <Cropper
        src={source}
        ref={cropperRef}
        background={true}
        cropend={onCropEnd}
        className='h-[400px] w-full'
        autoCropArea={0.1}
        cropmove={() => setShowOptions(false)}
      />
      {showOptions && (
        <button
          className='btn btn-success btn-sm absolute left-[45%] top-0 z-[9999999999]'
          onClick={downloadBlob}
        >
          Download
        </button>
      )}
    </div>
  );
}

export default memo(ImageCropper);
