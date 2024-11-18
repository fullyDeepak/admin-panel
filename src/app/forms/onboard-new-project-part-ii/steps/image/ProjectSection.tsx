'use client';

import { useProjectImageStore } from '../../useProjectImageStore';
import ProjectPDFImageSelector from './ProjectPDFImageSelector';
import FileList from './FileList';

export default function ProjectSection() {
  const { imagesStore, setImageFile, removeImageFile } = useProjectImageStore();
  return (
    <div className='flex flex-col gap-y-6'>
      <h3 className='mt-10 text-center text-2xl font-semibold'>
        Section: Project Image Form
      </h3>
      <section className='space-y-5 p-2'>
        <h4 className='text-xl font-semibold'>Section: Project Brochure</h4>
        <div className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select File:</span>
          <input
            type='file'
            className='file-input file-input-bordered ml-2 h-10 flex-[5]'
            multiple
            id='project-brochure-file'
            accept='.pdf'
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
        </div>
        <FileList
          imagesList={imagesStore.brochureFile}
          imgKey='brochureFile'
          removeImageFile={(key, fileName) =>
            removeImageFile(key as keyof typeof imagesStore, fileName)
          }
        />
      </section>
      <hr className='border-[1.5px] border-violet-300' />
      <section className='space-y-5 px-2'>
        <h4 className='text-xl font-semibold'>Section: Project Master Plan</h4>
        <div className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>Select File:</span>
          <div className='flex flex-[5] items-center gap-2'>
            <input
              type='file'
              className='file-input file-input-bordered h-10 w-full'
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
            <ProjectPDFImageSelector
              applyKey='masterPlanFile'
              applyFileName='master_plan'
            />
          </div>
        </div>
        <FileList
          imagesList={imagesStore.masterPlanFile}
          imgKey='masterPlanFile'
          removeImageFile={(key, fileName) =>
            removeImageFile(key as keyof typeof imagesStore, fileName)
          }
        />
      </section>
      <hr className='border-[1.5px] border-violet-300' />
      <section className='space-y-5 px-2'>
        <h4 className='text-xl font-semibold'>Section: Project Images</h4>
        <div className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>
            Select Primary Images:
          </span>
          <div className='flex flex-[5] items-center gap-2'>
            <input
              type='file'
              className='file-input file-input-bordered h-10 w-full'
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
            <ProjectPDFImageSelector
              applyKey='primaryImageFile'
              applyFileName='project-main-image'
            />
          </div>
        </div>
        <FileList
          imagesList={imagesStore.primaryImageFile}
          imgKey='primaryImageFile'
          removeImageFile={(key, fileName) =>
            removeImageFile(key as keyof typeof imagesStore, fileName)
          }
        />
        <div className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>
            Select Other Images:
          </span>
          <div className='flex flex-[5] items-center gap-2'>
            <input
              type='file'
              className='file-input file-input-bordered h-10 w-full'
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
            <ProjectPDFImageSelector
              applyKey='otherImageFile'
              applyFileName='project-image'
            />
          </div>
        </div>
        <FileList
          imagesList={imagesStore.otherImageFile}
          imgKey='otherImageFile'
          removeImageFile={(key, fileName) =>
            removeImageFile(key as keyof typeof imagesStore, fileName)
          }
        />
      </section>
      <hr className='border-[1.5px] border-violet-300' />
      <section className='space-y-5 px-2'>
        <h4 className='text-xl font-semibold'>Section: Project Other Docs</h4>
        <div className='relative flex flex-wrap items-center justify-between gap-5'>
          <span className='flex-[3] text-base md:text-xl'>
            Select Any Other Documents:
          </span>
          <div className='flex flex-[5] items-center gap-2'>
            <input
              type='file'
              className='file-input file-input-bordered h-10 w-full'
              multiple
              id='project-other-docs-file'
              accept='image/*'
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  Array.from(e.target.files).forEach((file) => {
                    setImageFile('otherDocs', {
                      name: file.name,
                      file: file,
                    });
                  });
                }
              }}
            />
            <ProjectPDFImageSelector
              applyKey='otherDocs'
              applyFileName='project-other-doc'
            />
          </div>
        </div>
        <FileList
          imagesList={imagesStore.otherDocs}
          imgKey='otherDocs'
          removeImageFile={(key, fileName) =>
            removeImageFile(key as keyof typeof imagesStore, fileName)
          }
        />
      </section>
    </div>
  );
}
