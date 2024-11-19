import ImageCropper from '@/components/ui/ImageCropper';
import { useState } from 'react';
import {
  ImageStoreState,
  useProjectImageStore,
} from '../../useProjectImageStore';
import { blobToFile } from '@/lib/image';

type Props = {
  selectedFile: File;
  projectImageKey: keyof ImageStoreState;
  setShowEditor: (value: boolean) => void;
  modalId: string;
};

export default function ReEditor({
  selectedFile,
  projectImageKey,
  setShowEditor,
  modalId,
}: Props) {
  const { setImageFile, removeImageFile } = useProjectImageStore();
  const [blob, setBlob] = useState<Blob | null>(null);

  function saveEditedImage() {
    if (!blob) return;
    removeImageFile(projectImageKey, selectedFile.name);
    setImageFile(projectImageKey, {
      name: selectedFile.name,
      file: blobToFile(blob, selectedFile.name),
    });
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
