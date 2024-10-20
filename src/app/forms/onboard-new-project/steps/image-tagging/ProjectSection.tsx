'use client';

import { Trash2 } from 'lucide-react';
import { useImageStore } from '../../useImageStore';

export default function ProjectSection() {
  const { imagesStore, setImageFile, removeImageFile } = useImageStore();
  return (
    <div className='flex flex-col gap-y-6'>
      <section className='space-y-5 p-2'>
        <h2 className='text-lg font-semibold'>Section: Project Brochure</h2>
        <label className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select File:</span>
          <input
            type='file'
            className='file-input file-input-bordered ml-2 h-10 flex-[5]'
            multiple
            id='project-brochure-file'
            accept='image/*,.pdf'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach((file) => {
                  setImageFile('brochureFile', {
                    name: file.name,
                    file: file,
                  });
                });
              }
            }}
          />
        </label>
        {imagesStore.brochureFile && imagesStore.brochureFile.length > 0 && (
          <div className='flex flex-col gap-y-2'>
            <div className='flex'>
              <span className='flex-[3] text-base md:text-xl'>
                Selected files:
              </span>
              <div className='ml-5 flex flex-[5] flex-col gap-2'>
                {imagesStore.brochureFile.map((file, idx) => (
                  <div className='flex items-center justify-between' key={idx}>
                    <span className=''>{file.name}</span>
                    <button
                      onClick={() => removeImageFile('brochureFile', file.name)}
                      className='flex size-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-500'
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      <hr className='border-[1.5px] border-violet-300' />
      <section className='space-y-5 px-2'>
        <h2 className='text-lg font-semibold'>Section: Project Master Plan</h2>
        <label className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select File:</span>
          <input
            type='file'
            className='file-input file-input-bordered ml-2 h-10 flex-[5]'
            multiple
            id='project-master-plan-file'
            accept='image/*,.pdf'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach((file) => {
                  setImageFile('masterPlanFile', {
                    name: file.name,
                    file: file,
                  });
                });
              }
            }}
          />
        </label>
        {imagesStore.masterPlanFile &&
          imagesStore.masterPlanFile.length > 0 && (
            <div className='flex flex-col gap-y-2'>
              <div className='flex'>
                <span className='flex-[3] text-base md:text-xl'>
                  Selected files:
                </span>
                <div className='ml-5 flex flex-[5] flex-col gap-2'>
                  {imagesStore.masterPlanFile.map((file, idx) => (
                    <div
                      className='flex items-center justify-between'
                      key={idx}
                    >
                      <span className=''>{file.name}</span>
                      <button
                        onClick={() =>
                          removeImageFile('masterPlanFile', file.name)
                        }
                        className='flex size-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-500'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </section>
      <hr className='border-[1.5px] border-violet-300' />
      <section className='space-y-5 px-2'>
        <h2 className='text-lg font-semibold'>Section: Project Images</h2>
        <label className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>
            Select Primary Images:
          </span>
          <input
            type='file'
            className='file-input file-input-bordered ml-2 h-10 flex-[5]'
            multiple
            id='project-primary-image-file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach((file) => {
                  setImageFile('primaryImageFile', {
                    name: file.name,
                    file: file,
                  });
                });
              }
            }}
          />
        </label>
        {imagesStore.primaryImageFile &&
          imagesStore.primaryImageFile.length > 0 && (
            <div className='flex flex-col gap-y-2'>
              <div className='flex'>
                <span className='flex-[3] text-base md:text-xl'>
                  Selected files:
                </span>
                <div className='ml-5 flex flex-[5] flex-col gap-2'>
                  {imagesStore.primaryImageFile.map((file, idx) => (
                    <div
                      className='flex items-center justify-between'
                      key={idx}
                    >
                      <span className=''>{file.name}</span>
                      <button
                        onClick={() =>
                          removeImageFile('primaryImageFile', file.name)
                        }
                        className='flex size-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-500'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        <label className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>
            Select Other Images:
          </span>
          <input
            type='file'
            className='file-input file-input-bordered ml-2 h-10 flex-[5]'
            multiple
            id='project-other-image-file'
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach((file) => {
                  setImageFile('otherImageFile', {
                    name: file.name,
                    file: file,
                  });
                });
              }
            }}
          />
        </label>
        {imagesStore.otherImageFile &&
          imagesStore.otherImageFile.length > 0 && (
            <div className='flex flex-col gap-y-2'>
              <div className='flex'>
                <span className='flex-[3] text-base md:text-xl'>
                  Selected files:
                </span>
                <div className='ml-5 flex flex-[5] flex-col gap-2'>
                  {imagesStore.otherImageFile.map((file, idx) => (
                    <div
                      className='flex items-center justify-between'
                      key={idx}
                    >
                      <span className=''>{file.name}</span>
                      <button
                        onClick={() =>
                          removeImageFile('otherImageFile', file.name)
                        }
                        className='flex size-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-500'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}
