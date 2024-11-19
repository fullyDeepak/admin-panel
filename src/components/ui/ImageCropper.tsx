import React, { memo, useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { resizeCanvasToSquare } from '@/lib/utils';
import { RotateCw } from 'lucide-react';

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
  const [rotate, setRotate] = useState(0);

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
    cropperRef.current?.cropper.rotateTo(rotate);
  }, [rotate]);

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
      <button
        className='tooltip absolute left-0 top-0 z-[9999999999] flex size-8 items-center justify-center rounded-full bg-neutral text-white'
        onClick={() =>
          setRotate((prev) => {
            if (prev === 270) return 0;
            return prev + 90;
          })
        }
        data-tip='Rotate clockwise'
      >
        <RotateCw size={16} />
      </button>
    </div>
  );
}

export default memo(ImageCropper);
