import ImageCropper from '@/components/ui/ImageCropper';
import { useState } from 'react';
import { ImageStoreState } from '../../useProjectImageStore';
import { blobToFile } from '@/lib/image';

type Props = {
  selectedFile: File;
  projectImageKey: keyof ImageStoreState;
  setShowEditor: (value: boolean) => void;
  setImageFile: (
    _key: string | number,
    _file: {
      name: string;
      file: File;
    }
  ) => void;
  removeImageFile: (_key: string | number, _fileName: string) => void;
  modalId: string;
  towerId?: number;
};

export default function ReEditor({
  selectedFile,
  projectImageKey,
  setShowEditor,
  modalId,
  removeImageFile,
  setImageFile,
  towerId,
}: Props) {
  const [blob, setBlob] = useState<Blob | null>(null);

  function saveEditedImage() {
    console.log('towerId', towerId);
    if (!blob) return;
    if (towerId) {
      removeImageFile(towerId, selectedFile.name);
      setImageFile(towerId, {
        name: selectedFile.name,
        file: blobToFile(blob, selectedFile.name),
      });
    } else {
      removeImageFile(projectImageKey as string, selectedFile.name);
      setImageFile(projectImageKey as string, {
        name: selectedFile.name,
        file: blobToFile(blob, selectedFile.name),
      });
    }
  }

  return (
    <div className='relative'>
      <ImageCropper src={selectedFile} saveBlob={setBlob} />
      <button
        className='btn btn-neutral absolute bottom-0 right-3 !h-10 !min-h-10'
        onClick={() => {
          setShowEditor(false);
          (document.getElementById(modalId) as HTMLDialogElement)?.close();
          saveEditedImage();
        }}
      >
        Save
      </button>
    </div>
  );
}
