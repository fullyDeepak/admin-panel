import { BookHeart } from 'lucide-react';
import { useProjectImageStore } from '../../useProjectImageStore';
import { useState } from 'react';
import PDFViewer from '@/components/ui/PdfViewer';
import ImageCropper from '@/components/ui/ImageCropper';
import { pdfToImage } from '@/lib/image';

type Props = {
  smallButton?: boolean;
  applyKey:
    | 'masterPlanFile'
    | 'primaryImageFile'
    | 'otherImageFile'
    | 'otherDocs';
  applyFileName: string;
};

export default function ProjectPDFImageSelector({
  smallButton,
  applyKey,
  applyFileName,
}: Props) {
  const { brochureFile, setImageFile, imagesStore } = useProjectImageStore(
    (state) => ({
      brochureFile: state.imagesStore.brochureFile,
      setImageFile: state.setImageFile,
      imagesStore: state.imagesStore,
    })
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [dpi, setDpi] = useState(300);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>(applyFileName);

  function handleAssign() {
    if (!convertedBlob) return;
    if (applyKey === 'masterPlanFile') {
      const length = imagesStore.masterPlanFile.length;
      const imgFile = new File(
        [convertedBlob],
        `${fileName}-${length + 1}.png`,
        {
          type: 'image/png',
        }
      );
      setImageFile('masterPlanFile', {
        name: imgFile.name,
        file: imgFile,
      });
    } else if (applyKey === 'primaryImageFile') {
      const length = imagesStore.primaryImageFile.length;
      const imgFile = new File(
        [convertedBlob],
        `${fileName}-${length + 1}.png`,
        {
          type: 'image/png',
        }
      );
      setImageFile('primaryImageFile', {
        name: imgFile.name,
        file: imgFile,
      });
    } else if (applyKey === 'otherImageFile') {
      const length = imagesStore.otherImageFile.length;
      const imgFile = new File(
        [convertedBlob],
        `${fileName}-${length + 1}.png`,
        {
          type: 'image/png',
        }
      );
      setImageFile('otherImageFile', {
        name: imgFile.name,
        file: imgFile,
      });
    } else if (applyKey === 'otherDocs') {
      const length = imagesStore.otherDocs.length;
      const imgFile = new File(
        [convertedBlob],
        `${fileName}-${length + 1}.png`,
        {
          type: 'image/png',
        }
      );
      setImageFile('otherDocs', {
        name: imgFile.name,
        file: imgFile,
      });
    }
    (
      document.getElementById(
        `pdf-image-cropper-${applyKey}`
      ) as HTMLDialogElement
    ).close();
  }

  return brochureFile?.length > 0 ? (
    <div>
      {brochureFile.length > 1 ? (
        <div className='dropdown'>
          {smallButton ? (
            <div
              tabIndex={0}
              role='button'
              className='btn btn-neutral btn-xs !min-h-8 !min-w-8'
            >
              <span className='tooltip' data-tip='Choose from brochure'>
                <BookHeart size={20} />
              </span>
            </div>
          ) : (
            <div
              tabIndex={0}
              role='button'
              className='btn btn-neutral btn-xs flex !min-h-10 !min-w-36 !flex-row items-center'
            >
              <BookHeart size={24} />
              <span className='w-20'>Choose from brochure</span>
            </div>
          )}

          <ul
            tabIndex={0}
            className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 text-xs shadow'
          >
            {brochureFile.map((file, idx) => (
              <li key={idx}>
                <a
                  onClick={() => {
                    setSelectedFile(file.file);
                    (
                      document.getElementById(
                        `pdf-image-cropper-${applyKey}`
                      ) as HTMLDialogElement
                    ).showModal();
                  }}
                  className='p-1.5'
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        brochureFile.length === 1 && (
          <button
            className='btn btn-neutral btn-xs flex !min-h-10 !min-w-36 !flex-row items-center'
            onClick={() => {
              setSelectedFile(brochureFile[0].file);
              (
                document.getElementById(
                  `pdf-image-cropper-${applyKey}`
                ) as HTMLDialogElement
              ).showModal();
            }}
          >
            <BookHeart size={24} />
            <span className='w-20'>Choose from brochure</span>
          </button>
        )
      )}
      <dialog id={`pdf-image-cropper-${applyKey}`} className='modal'>
        <div className='modal-box max-w-[85vw] overflow-hidden'>
          <form method='dialog'>
            <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2 !min-h-4 !min-w-4'>
              ✕
            </button>
          </form>
          {selectedFile && selectedFile.type === 'application/pdf' && (
            <div className='flex flex-col gap-5 px-5'>
              <div className='flex items-center gap-5 self-center'>
                <button
                  className='btn btn-neutral btn-sm max-w-fit'
                  onClick={async () => {
                    const imgFile = await pdfToImage(
                      URL.createObjectURL(selectedFile),
                      pageNumber,
                      dpi
                    );
                    setSelectedFile(imgFile);
                  }}
                >
                  Edit this page
                </button>
                <input
                  type='number'
                  value={dpi || ''}
                  min={1}
                  onChange={(e) => setDpi(e.target.valueAsNumber)}
                  placeholder='DPI'
                  className={
                    'w-32 rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  }
                />
              </div>
              <div className='h-[70vh] w-full'>
                <PDFViewer
                  type='fileContent'
                  fileContent={selectedFile}
                  setPageNumber={setPageNumber}
                />
              </div>
            </div>
          )}
          {selectedFile && selectedFile.type.includes('image') && (
            <div className='flex items-center gap-5 p-5'>
              <div className='flex-[3]'>
                <ImageCropper src={selectedFile} saveBlob={setConvertedBlob} />
              </div>
              <div className='flex flex-1 flex-col gap-5'>
                <input
                  type='text'
                  value={fileName}
                  min={1}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder='File Name'
                  className={
                    'rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  }
                />
                <button
                  className='btn btn-neutral btn-sm'
                  onClick={handleAssign}
                  disabled={!convertedBlob}
                >
                  Assign
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  ) : null;
}
