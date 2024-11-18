import { Trash2 } from 'lucide-react';
import { TowerUnitDetailType } from '../../useTowerUnitStore';

type Props = {
  tower: TowerUnitDetailType;
  updateTowerFormData: (
    _towerCardId: number,
    _newDetails: Partial<TowerUnitDetailType>
  ) => void;
  setTowerFloorPlanFile: (
    _towerCardId: number,
    imageData: {
      name: string;
      file: File;
    }
  ) => void;
  removeTowerFloorPlanFile: (_towerCardId: number, name: string) => void;
};

export default function TowerDetails({
  tower,
  updateTowerFormData,
  removeTowerFloorPlanFile,
  setTowerFloorPlanFile,
}: Props) {
  return (
    <div className='flex flex-col'>
      <h3 className='my-4 text-2xl font-semibold'>Section: Tower Details</h3>
      <div className='grid grid-cols-4 items-center gap-x-5 gap-y-1'>
        <span className=''>ETL Tower ID & Name:</span>
        <span className='flex h-6 items-center rounded-md border-0 px-2 text-gray-900 placeholder:text-gray-400'>{`${tower.tower_id} : ${tower.towerNameETL}`}</span>
        <span className='fl'>RERA ID and RERA Tower ID:</span>
        <span className='flex h-6 items-center rounded-md border-0 px-2 text-gray-900 placeholder:text-gray-400'>
          {tower.reraId ? `${tower.reraId} : ${tower.reraTowerId}` : 'N/A'}
        </span>
        <span className='flex-[3]'>Tower Floor Plan:</span>
        <div className='flex items-center gap-2'>
          <input
            type='file'
            className='file-input file-input-bordered file-input-accent file-input-xs h-8 w-52'
            multiple
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach((file) => {
                  setTowerFloorPlanFile(tower.tower_id, {
                    file: file,
                    name: file.name,
                  });
                });
              }
            }}
          />
        </div>
        <span className='fl'>Tower Type:</span>
        <span className='flex h-6 items-center rounded-md border-0 px-2 text-gray-900 placeholder:text-gray-400'>
          {tower.towerType ? tower.towerType : 'N/A'}
        </span>
        <span>Typical Floor:</span>
        <div className='flex items-center gap-2'>
          <div className='float-label-input-group relative'>
            <input
              type='number'
              defaultValue={tower.typicalMaxFloor ? tower.typicalMaxFloor : ''}
              onChange={(e) =>
                updateTowerFormData(tower.tower_id, {
                  typicalMaxFloor: +e.target.value,
                })
              }
              id='max-floor'
              placeholder=''
              className='group peer w-full rounded-md border-0 bg-transparent px-2 pb-1 pt-3 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
            />
            <label
              className='absolute left-5 top-2 cursor-text text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:left-1 peer-focus:px-1 peer-focus:text-[10px] peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500'
              htmlFor='max-floor'
            >
              <span className='bg-white px-1'>Max Floor</span>
            </label>
          </div>
          <div className='float-label-input-group relative'>
            <input
              type='text'
              defaultValue={tower.typicalUnitCount}
              id='unit-count'
              onChange={(e) =>
                updateTowerFormData(tower.tower_id, {
                  typicalUnitCount: e.target.value,
                })
              }
              placeholder=''
              className='group peer w-full rounded-md border-0 bg-transparent px-2 pb-1 pt-3 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
            />
            <label
              className='absolute left-5 top-2 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:left-1 peer-focus:px-1 peer-focus:text-[10px] peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500'
              htmlFor='unit-count'
            >
              <span className='bg-white px-1'> Unit Count</span>
            </label>
          </div>
        </div>
        <span>Ground Floor:</span>
        <div className='flex items-center gap-2'>
          <div className='float-label-input-group relative'>
            <input
              type='text'
              defaultValue={tower.gfName}
              id='ground-floor-name'
              onChange={(e) =>
                updateTowerFormData(tower.tower_id, {
                  gfName: e.target.value,
                })
              }
              placeholder=''
              className='group peer w-full rounded-md border-0 bg-transparent px-2 pb-1 pt-3 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
            />
            <label
              className='absolute left-6 top-2 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:left-1 peer-focus:px-1 peer-focus:text-[10px] peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500'
              htmlFor='ground-floor-name'
            >
              <span className='bg-white px-1'>GF Name</span>
            </label>
          </div>
          <div className='float-label-input-group relative'>
            <input
              type='text'
              defaultValue={tower.gfUnitCount}
              id='gf-unit-count'
              onChange={(e) =>
                updateTowerFormData(tower.tower_id, {
                  gfUnitCount: e.target.value,
                })
              }
              placeholder=''
              className='group peer w-full rounded-md border-0 bg-transparent px-2 pb-1 pt-3 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
            />
            <label
              className='absolute left-5 top-2 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:left-1 peer-focus:px-1 peer-focus:text-[10px] peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-1 peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500'
              htmlFor='gf-unit-count'
            >
              <span className='bg-white px-1'>Unit Count</span>
            </label>
          </div>
        </div>
      </div>

      {tower.towerFloorPlanFile && tower.towerFloorPlanFile.length > 0 && (
        <div className='mt-3 flex flex-col gap-y-2'>
          <div className='flex'>
            <span className='flex-[3] text-sm'>Selected files:</span>
            <div className='ml-5 flex flex-[5] flex-col gap-2'>
              {tower.towerFloorPlanFile.map((file, idx) => (
                <div className='flex items-center justify-between' key={idx}>
                  <span className=''>{file.name}</span>
                  <button
                    onClick={() =>
                      removeTowerFloorPlanFile(tower.tower_id, file.name)
                    }
                    className='flex size-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-500'
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button disabled className='btn btn-warning mt-2 max-w-fit self-center'>
        Generate Grid
      </button>
    </div>
  );
}
