'use client';

import axiosClient from '@/utils/AxiosClient';
import toast, { Toaster } from 'react-hot-toast';
import { CgInfo } from 'react-icons/cg';

export default function StartETLPage() {
  async function handleETLStart() {
    let toastId: string = toast.loading('Starting process...');
    const response = await axiosClient.post('/etl/startEtlProcess');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (response.status === 200) {
      toast.success('Process started.', { id: toastId, duration: 3000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      (
        document.getElementById('etl-start-confirm-modal') as HTMLDialogElement
      ).close();
      (document.getElementById('etl-start-modal') as HTMLDialogElement).close();
    } else {
      toast.error('Something went wrong', { id: toastId, duration: 3000 });
    }
  }
  return (
    <div className='relative mt-40 flex items-center justify-center'>
      <dialog id='etl-start-confirm-modal' className='modal backdrop-blur-xl'>
        <Toaster />
        <div className='modal-box h-[40%]'>
          <div className='flex flex-col items-center  justify-center text-red-500'>
            <CgInfo size={60} />
            <h3 className='text-3xl font-bold '>Please Confirm again</h3>
          </div>
          <div className='mt-5 flex flex-col gap-3'>
            <div className='flex '>
              <span className='font-semibold'>
                This will start ETL Process.
              </span>
            </div>
          </div>
          <div className='mt-10 flex justify-evenly'>
            <button
              type='button'
              onClick={() => {
                handleETLStart();
              }}
              className='btn btn-error btn-sm text-white'
            >
              Confirm
            </button>
            <button
              type='button'
              onClick={() => {
                (
                  document.getElementById(
                    'etl-start-confirm-modal'
                  ) as HTMLDialogElement
                ).close();
              }}
              className='btn btn-neutral btn-sm'
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
      <dialog id='etl-start-modal' className='modal backdrop-blur-sm'>
        <div className='modal-box h-[50%]'>
          <div className='flex flex-col items-center  justify-center text-red-500'>
            <CgInfo size={60} />
            <h3 className='text-3xl font-bold '>Attention Please !!!</h3>
            <h2 className='text-xl font-bold '>
              You have entered the danger area.
            </h2>
          </div>
          <p className='py-4'>Do you really want to start ETL Process?</p>
          <div className='flex flex-col gap-3'>
            <div className='flex '>
              <span className='font-semibold'>
                This action can&apos;t be undone.
              </span>
            </div>
          </div>
          <div className='mt-10 flex justify-evenly'>
            <button
              type='button'
              onClick={() =>
                (
                  document.getElementById(
                    'etl-start-modal'
                  ) as HTMLDialogElement
                ).close()
              }
              className='btn btn-neutral btn-sm'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={() => {
                (
                  document.getElementById(
                    'etl-start-confirm-modal'
                  ) as HTMLDialogElement
                ).showModal();
              }}
              className='btn btn-error btn-sm text-white'
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
      <button
        className='btn btn-error btn-lg btn-wide text-white'
        onClick={() =>
          (
            document.getElementById('etl-start-modal') as HTMLDialogElement
          ).showModal()
        }
      >
        Start ETL Process
      </button>
    </div>
  );
}
