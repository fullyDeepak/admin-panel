import { Eye } from 'lucide-react';

import Image from 'next/image';

type Props = {
  url: string;
  customModalSuffix?: string;
};

export default function PreviewImage({ url, customModalSuffix }: Props) {
  return (
    <div className='flex flex-col gap-y-2'>
      <dialog
        id={`image-form-unit-preview-modal-${customModalSuffix}`}
        className='modal'
      >
        <div className='modal-box relative'>
          <div className='flex flex-col gap-1'>
            <p className='text-center text-2xl font-semibold'>Preview</p>
          </div>

          <div className='flex items-center justify-center'>
            <Image
              alt='Preview'
              src={url}
              width={400}
              height={400}
              className='border-4 border-violet-500'
            />
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <div className='flex'>
        <button
          onClick={() => {
            (
              document.getElementById(
                `image-form-unit-preview-modal-${customModalSuffix}`
              ) as HTMLDialogElement
            ).showModal();
          }}
          className='flex size-5 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-600'
        >
          <Eye size={15} />
        </button>
      </div>
    </div>
  );
}
