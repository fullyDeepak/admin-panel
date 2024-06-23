'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { CgInfo } from 'react-icons/cg';

export default function UMGenerator() {
  async function handleUMStart() {
    let toastId: string = toast.loading('Starting UM Generator...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axiosClient.post('/unitmaster/generate');
      if (response.status === 200) {
        toast.success('UM Generation Process started.', {
          id: toastId,
          duration: 3000,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        (
          document.getElementById(
            'um-generate-confirm-modal'
          ) as HTMLDialogElement
        ).close();
        (
          document.getElementById('um-generate-modal') as HTMLDialogElement
        ).close();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status &&
        error.response?.status >= 400
      ) {
        const errMsg =
          error.response.data?.message || error.response.data?.error;
        toast.error(`Error: ${errMsg}`, {
          id: toastId,
          duration: 3000,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        toast.dismiss(toastId);
        toast.error("Couldn't send data to server.", {
          id: toastId,
          duration: 3000,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        (
          document.getElementById(
            'um-generate-confirm-modal'
          ) as HTMLDialogElement
        ).close();
        (
          document.getElementById('um-generate-modal') as HTMLDialogElement
        ).close();
      }
    }
  }
  return (
    <div className='relative mt-40 flex flex-wrap items-center justify-center gap-10'>
      <div>
        <Toaster />
        <dialog
          id='um-generate-confirm-modal'
          className='modal backdrop-blur-xl'
        >
          <Toaster />
          <div className='modal-box h-[40%]'>
            <div className='flex flex-col items-center justify-center text-red-500'>
              <CgInfo size={60} />
              <h3 className='text-3xl font-bold'>Please Confirm again</h3>
            </div>
            <div className='mt-5 flex flex-col gap-3'>
              <div className='flex'>
                <span className='font-semibold'>
                  This will start UM generator.
                </span>
              </div>
            </div>
            <div className='mt-10 flex justify-evenly'>
              <button
                type='button'
                onClick={() => {
                  handleUMStart();
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
                      'um-generate-confirm-modal'
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
        <dialog id='um-generate-modal' className='modal backdrop-blur-sm'>
          <div className='modal-box h-[50%]'>
            <div className='flex flex-col items-center justify-center text-red-500'>
              <CgInfo size={60} />
              <h3 className='text-3xl font-bold'>Attention Please !!!</h3>
              <h2 className='text-xl font-bold'>
                You have entered the danger area.
              </h2>
            </div>
            <p className='py-4'>
              Do you really want to start{' '}
              <span className='font-semibold'>UM Generator</span>?
            </p>
            <div className='flex flex-col gap-3'>
              <div className='flex'>
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
                      'um-generate-modal'
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
                      'um-generate-confirm-modal'
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
              document.getElementById('um-generate-modal') as HTMLDialogElement
            ).showModal()
          }
        >
          Generate UM
        </button>
      </div>
    </div>
  );
}
