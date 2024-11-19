import { Edit2, Eye, Trash2 } from 'lucide-react';
import { ImageStoreState } from '../../useProjectImageStore';
import { useState } from 'react';
import Image from 'next/image';
import ReEditor from './ReEditor';

type Props = {
  imagesList: {
    name: string;
    file: File;
  }[];
  imgKey: keyof ImageStoreState;
  removeImageFile: (_key: string | number, _fileName: string) => void;
  customModalSuffix?: string;
  towerId?: number;
};

export default function FileList({
  imagesList,
  imgKey,
  removeImageFile,
  customModalSuffix,
  towerId,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  return (
    imagesList &&
    imagesList.length > 0 && (
      <div className='flex flex-col gap-y-2'>
        <dialog
          id={`image-form-preview-modal-${imgKey}${customModalSuffix}`}
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
              <ReEditor
                projectImageKey={imgKey}
                selectedFile={selectedFile}
                setShowEditor={setShowEditor}
                modalId={`image-form-preview-modal-${imgKey}${customModalSuffix}`}
              />
            )}
          </div>
          <form method='dialog' className='modal-backdrop'>
            <button onClick={() => setShowEditor(false)}>close</button>
          </form>
        </dialog>
        <div className='flex'>
          <span className='flex-[3] text-base md:text-xl'>Selected files:</span>
          <div className='ml-5 flex flex-[5] flex-col gap-2'>
            {imagesList.map((file, idx) => (
              <div
                className='flex items-center justify-between'
                key={`${file.name}-${idx}`}
              >
                <span className=''>{file.name}</span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setSelectedFile(file.file);
                      (
                        document.getElementById(
                          `image-form-preview-modal-${imgKey}${customModalSuffix}`
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                    key={`${file.name}-${idx}`}
                    className='flex size-8 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-600'
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (towerId) {
                        removeImageFile(towerId, file.name);
                      } else {
                        removeImageFile(imgKey, file.name);
                      }
                    }}
                    className='flex size-8 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-600'
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
