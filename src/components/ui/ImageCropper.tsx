import React, { memo, useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { resizeCanvasToSquare } from '@/lib/image';
import { RotateCcw, RotateCw } from 'lucide-react';

type Props = {
  src: File;
  saveBlob?: (data: Blob | null) => void;
};

function ImageCropper({ src, saveBlob }: Props) {
  if (!src) return <></>;
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
    <div className='relative'>
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
      <div className='mt-2 flex max-w-lg items-center gap-5 rounded-md border-2 p-2 shadow-c2'>
        <span className='min-w-28 tabular-nums'>Rotate: {rotate}°</span>
        <input
          type='range'
          className='range range-xs bg-violet-200 [--range-shdw:#7c3aed]'
          min={0}
          max={360}
          value={rotate}
          onChange={(e) => setRotate(e.target.valueAsNumber)}
        />
        <div className='flex gap-2'>
          <button
            className='flex size-8 items-center justify-center rounded-full bg-violet-600 text-white'
            onClick={() => {
              setRotate((prev) => {
                if (prev === 0) {
                  return 270;
                }
                const roundToNearest90 = (angle: number) =>
                  Math.ceil(angle / 90) * 90;
                if (prev > 0 && prev < 360) {
                  return roundToNearest90(prev - 90 + 360) % 360;
                }
                return (prev - 90 + 360) % 360;
              });
            }}
          >
            <RotateCcw size={16} />
          </button>
          <button
            className='flex size-8 items-center justify-center rounded-full bg-violet-600 text-white'
            onClick={() => {
              setRotate((prev) => {
                if (prev === 0) {
                  return 90;
                }
                const roundToNearest90 = (angle: number) =>
                  Math.floor(angle / 90) * 90;
                if (prev > 0 && prev < 360) {
                  return roundToNearest90(prev + 90 + 360) % 360;
                }
                return (prev + 90 + 360) % 360;
              });
            }}
          >
            <RotateCw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ImageCropper);
