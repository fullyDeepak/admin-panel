import { Edit2, Eye, Trash2 } from 'lucide-react';
import { ImageItem } from '../../useProjectImageStore';
import { useState } from 'react';
import Image from 'next/image';
import { UnitCardType } from '../../useTowerUnitStore';
import ImageCropper from '@/components/ui/ImageCropper';
import { blobToFile } from '@/lib/image';

type Props = {
  image: ImageItem | null;
  customModalSuffix?: string;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  towerId: number;
  unitId: number;
};

export default function UnitFileList({
  image,
  customModalSuffix,
  updateUnitCard,
  towerId,
  unitId,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);

  function saveEditedImage() {
    if (!blob || !image) return;
    updateUnitCard(towerId, unitId, {
      unitFloorPlanFile: {
        name: image.name,
        file: blobToFile(blob, image.name),
      },
    });
  }

  return (
    image && (
      <div className='flex flex-col gap-y-2'>
        <dialog
          id={`image-form-unit-preview-modal-${customModalSuffix}`}
          className='modal'
        >
          <div className='modal-box relative max-w-3xl'>
            <div className='flex flex-col gap-1'>
              <p className='text-center text-2xl font-semibold'>
                {showEditor ? 'Editing' : 'Preview of'} &quot;
                {selectedFile?.name}&quot;
              </p>
              {!showEditor && (
                <span>
                  File Size:{' '}
                  {selectedFile?.size
                    ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                    : '0KB'}
                </span>
              )}
            </div>
            {!showEditor &&
              selectedFile &&
              selectedFile.type === 'application/pdf' && (
                <iframe
                  src={URL.createObjectURL(selectedFile)}
                  style={{ width: '100%', height: '400px' }}
                  className='mx-auto rounded-2xl'
                ></iframe>
              )}
            {!showEditor &&
              selectedFile &&
              selectedFile.type.includes('image') && (
                <div className='flex items-center justify-center'>
                  <Image
                    alt='Preview'
                    src={URL.createObjectURL(selectedFile)}
                    width={400}
                    height={400}
                    className='border-4 border-violet-500'
                  />
                </div>
              )}
            {!showEditor &&
              selectedFile &&
              selectedFile.type.includes('image') && (
                <button
                  className='btn btn-circle btn-neutral absolute bottom-8 right-8'
                  onClick={() => setShowEditor(true)}
                >
                  <Edit2 size={20} />
                </button>
              )}

            {showEditor && selectedFile && (
              <div className='relative'>
                <ImageCropper src={selectedFile} saveBlob={setBlob} />
                <button
                  className='btn btn-neutral absolute bottom-0 right-3 !h-10 !min-h-10'
                  onClick={() => {
                    setShowEditor(false);
                    (
                      document.getElementById(
                        `image-form-unit-preview-modal-${customModalSuffix}`
                      ) as HTMLDialogElement
                    )?.close();
                    saveEditedImage();
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          <form method='dialog' className='modal-backdrop'>
            <button onClick={() => setShowEditor(false)}>close</button>
          </form>
        </dialog>
        <div className='flex'>
          <span className='flex-[3] text-base'>Selected files:</span>
          <div className='ml-5 flex flex-[5] flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <span>{image.name}</span>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setSelectedFile(image.file);
                    (
                      document.getElementById(
                        `image-form-unit-preview-modal-${customModalSuffix}`
                      ) as HTMLDialogElement
                    ).showModal();
                  }}
                  className='flex size-8 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-600'
                >
                  <Eye size={18} />
                </button>
                <button className='flex size-8 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-600'>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

// floor + unit nos + salable area
// unit no + extent + salable area
