import { BookHeart } from 'lucide-react';
import { useState } from 'react';
import ImageCropper from '@/components/ui/ImageCropper';
import { UnitCardType } from '../../useTowerUnitStore';

type Props = {
  smallButton?: boolean;
  towerImage: { name: string; file: File }[];
  towerId: number;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  unitCards: UnitCardType[];
};

export default function UnitImageSelector({
  smallButton,
  towerImage,
  towerId,
  unitCards,
  updateUnitCard,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');

  function handleAssign() {
    if (!convertedBlob) return;
    const [unitId] = fileName.split(':');
    const imgFile = new File([convertedBlob], 'unit-floor-plan.png', {
      type: 'image/png',
    });
    updateUnitCard(towerId, +unitId, {
      unitFloorPlanFile: {
        name: imgFile.name,
        file: imgFile,
      },
    });
    setConvertedBlob(null);
  }

  return towerImage?.length > 0 ? (
    <div>
      {towerImage.length > 1 ? (
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
              <span className='w-28'>Choose from tower floor plan</span>
            </div>
          )}

          <ul
            tabIndex={0}
            className='menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 text-xs shadow'
          >
            {towerImage.map((file, idx) => (
              <li key={idx}>
                <a
                  onClick={() => {
                    setSelectedFile(file.file);
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
      ) : (
        towerImage.length === 1 && (
          <button
            className='btn btn-neutral btn-xs flex !min-h-10 !min-w-36 !flex-row items-center'
            onClick={() => {
              setSelectedFile(towerImage[0].file);
              setConvertedBlob(null);
              setFileName('');
              (
                document.getElementById(
                  `pdf-image-cropper-tower`
                ) as HTMLDialogElement
              ).showModal();
            }}
          >
            <BookHeart size={24} />
            <span className='w-28'>Choose from tower floor plan</span>
          </button>
        )
      )}
      <dialog id={`pdf-image-cropper-tower`} className='modal'>
        <div className='modal-box max-w-[85vw] overflow-hidden'>
          <form method='dialog'>
            <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2 !min-h-4 !min-w-4'>
              ✕
            </button>
          </form>
          {selectedFile && selectedFile.type.includes('image') && (
            <div className='flex items-center gap-2 p-5'>
              <div className='flex-[3]'>
                <ImageCropper src={selectedFile} saveBlob={setConvertedBlob} />
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                {/* <input
                  type='text'
                  value={fileName || ''}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder='File Name'
                  className={
                    'rounded-md border-0 bg-transparent p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  }
                /> */}
                {/* <span className='-my-1 ml-2 text-xs text-amber-600'>
                  Warning: Don&apos;t remove unit id from file name.
                </span> */}
                <select
                  className='h-9 min-h-9 w-full flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none !pe-1 !pl-1 !pr-5 ps-3 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
                  onChange={(e) => setFileName(e.target.value)}
                >
                  <option value='' selected disabled>
                    Select Unit
                  </option>
                  {unitCards.map((unit, idx) => (
                    <option
                      key={idx}
                      value={`${unit.id}:${unit.floorNos}:${unit.unitNos}:${unit.extent}:${unit.salableArea}`}
                    >
                      {`${unit.id}:${unit.floorNos}:${unit.unitNos}:${unit.extent}:${unit.salableArea}`}
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
