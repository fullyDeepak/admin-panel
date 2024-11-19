import { BookHeart } from 'lucide-react';
import { useProjectImageStore } from '../../useProjectImageStore';
import { useState } from 'react';
import PDFViewer from '@/components/ui/PdfViewer';
import ImageCropper from '@/components/ui/ImageCropper';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import { pdfToImage } from '@/lib/image';

type Props = {
  smallButton?: boolean;
};

export default function ProjectPDFImageSelector({ smallButton }: Props) {
  const { brochureFile } = useProjectImageStore((state) => ({
    brochureFile: state.imagesStore.brochureFile,
  }));
  const { setTowerFloorPlanFile, towerFormData } = useTowerUnitStore(
    (state) => ({
      towerFormData: state.towerFormData,
      setTowerFloorPlanFile: state.setTowerFloorPlanFile,
    })
  );
  const [selectedBrochureFile, setSelectedBrochureFile] = useState<File | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [dpi, setDpi] = useState(300);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);

  function handleAssign() {
    if (!convertedBlob) return;
    const [tower_id, towerName] = fileName.split(':');
    const length = towerFormData.find((item) => item.tower_id === +tower_id)
      ?.towerFloorPlanFile?.length;
    const imgFile = new File(
      [convertedBlob],
      `${towerName.toLowerCase().replaceAll(' ', '-')}-floor-plan-${(length || 0) + 1}.png`,
      {
        type: 'image/png',
      }
    );
    setTowerFloorPlanFile(+tower_id, {
      name: imgFile.name,
      file: imgFile,
    });
    setShowEditor(false);
    setConvertedBlob(null);
  }

  return brochureFile?.length > 0 ? (
    <div>
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
                  setSelectedBrochureFile(file.file);
                  setSelectedFile(null);
                  setConvertedBlob(null);
                  setFileName('');
                  (
                    document.getElementById(
                      `pdf-image-cropper-tower`
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
      <dialog id={`pdf-image-cropper-tower`} className='modal'>
        <div className='modal-box max-w-[85vw] overflow-hidden'>
          <form method='dialog'>
            <button
              className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2 !min-h-4 !min-w-4'
              onClick={() => setShowEditor(false)}
            >
              ✕
            </button>
          </form>
          {!showEditor &&
            selectedBrochureFile &&
            selectedBrochureFile.type === 'application/pdf' && (
              <div className='flex flex-col gap-5 px-5'>
                <div className='flex items-center gap-5 self-center'>
                  <button
                    className='btn btn-neutral btn-sm max-w-fit'
                    onClick={async () => {
                      const imgFile = await pdfToImage(
                        URL.createObjectURL(selectedBrochureFile),
                        pageNumber,
                        dpi
                      );
                      setSelectedFile(imgFile);
                      setShowEditor(true);
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
                    fileContent={selectedBrochureFile}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                  />
                </div>
              </div>
            )}
          {showEditor &&
            selectedFile &&
            selectedFile.type.includes('image') && (
              <div className='flex items-center gap-2 p-5'>
                <div className='flex-[3]'>
                  <ImageCropper
                    src={selectedFile}
                    saveBlob={setConvertedBlob}
                  />
                </div>
                <div className='flex flex-1 flex-col gap-2'>
                  <input
                    type='text'
                    value={fileName || ''}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder='File Name'
                    className={
                      'rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                    }
                  />
                  <span className='-my-1 ml-2 text-xs text-amber-600'>
                    Warning: Don&apos;t remove tower id from file name.
                  </span>
                  <select
                    className='h-9 min-h-9 w-full flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none !pe-1 !pl-1 !pr-5 ps-3 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
                    onChange={(e) => setFileName(e.target.value)}
                  >
                    <option value='' selected disabled>
                      Select Tower
                    </option>
                    {towerFormData.map((tower, idx) => (
                      <option
                        key={idx}
                        value={`${tower.tower_id}:${tower.towerNameETL}`}
                      >
                        {`${tower.tower_id}:${tower.towerNameETL}`}
                      </option>
                    ))}
                  </select>
                  <button
                    className='btn btn-neutral btn-sm'
                    onClick={handleAssign}
                    disabled={!(convertedBlob && fileName.length > 0)}
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
