import {
  RefTableType,
  TowerUnitDetailType,
  UnitCardType,
} from '../../useTowerUnitStore';

type Props = {
  tower: {
    tower_id: number;
    reraId: string;
    reraTowerId: string;
    towerNameDisplay: string;
    towerNameETL: string;
    typicalMaxFloor: number;
    typicalUnitCount: string;
    gfName: string;
    gfUnitCount: string;
    unitCards: UnitCardType[];
    reraRefTable: RefTableType[];
    tmRefTable: (RefTableType & {
      extent: string;
    })[];
  };
  updateTowerFormData: (
    _towerCardId: number,
    _newDetails: Partial<TowerUnitDetailType>
  ) => void;
};

export default function TowerDetails({ tower, updateTowerFormData }: Props) {
  return (
    <div className='flex flex-col'>
      <h3 className='my-4 text-2xl font-semibold'>Section: Tower Details</h3>
      <div className='grid grid-cols-4 items-center gap-x-5 gap-y-1'>
        <span className=''>ETL Tower ID & Name:</span>
        <span className='flex h-6 items-center rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>{`${tower.tower_id} : ${tower.towerNameETL}`}</span>
        <span className='fl'>RERA ID and RERA Tower ID:</span>
        <span className='flex h-6 items-center rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
          {tower.reraId ? `${tower.reraId} : ${tower.reraTowerId}` : 'N/A'}
        </span>
        <span className='flex-[3]'>Tower Floor Plan:</span>
        <input
          type='file'
          className='file-input file-input-bordered file-input-accent file-input-xs h-8'
          multiple
          disabled
          accept='image/*'
        />
        <span className='fl'>Tower Type:</span>
        <span className='flex h-6 items-center rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
          {tower.reraId ? `${tower.reraId} : ${tower.reraTowerId}` : 'N/A'}
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

      <button disabled className='btn btn-warning mt-2 max-w-fit self-center'>
        Generate Grid
      </button>
    </div>
  );
}