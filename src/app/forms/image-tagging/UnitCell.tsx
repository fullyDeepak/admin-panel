import { getRandomColor } from '@/lib/utils';
import { nanoid } from 'nanoid';

type UnitCellProps = {
  towerId: number;
  floorNumber: number;
  fullUnitName: string;
  unitNumber: string;
  unitType: number | null;
  s3Path: string;
  previewURL: string;
  setShowUnitModal: (_val: boolean) => void;
  setPreviewUnitDocsData: (
    _newData: {
      tower_id: number;
      s3_path: string;
      preview_url: string;
      unitType: number | null;
      fName: string;
    } | null
  ) => void;
};

export default function UnitCell({
  towerId,
  floorNumber,
  fullUnitName,
  unitNumber,
  unitType,
  s3Path,
  previewURL,
  setPreviewUnitDocsData,
  setShowUnitModal,
}: UnitCellProps) {
  let color = '';
  if (unitType) {
    color = getRandomColor(unitType);
  }

  const previewData = {
    tower_id: towerId,
    s3_path: s3Path,
    preview_url: previewURL,
    file_type: 'image' as 'image' | 'pdf',
    unitType: unitType,
    fName: fullUnitName,
  };

  return (
    <label className='swap'>
      <button
        id={nanoid()}
        style={{
          backgroundColor: color ? color : '#e4e4e4',
          opacity: color ? 1 : 0.6,
        }}
        className='min-w-32 rounded-full border px-4 py-2 text-center text-sm hover:brightness-90 disabled:cursor-not-allowed'
        onClick={() => {
          setShowUnitModal(true);
          setPreviewUnitDocsData(previewData);
        }}
        type='button'
        disabled={!previewData.preview_url}
      >
        <p className='flex flex-col leading-4'>
          <span>
            {floorNumber}-{unitNumber}
          </span>
          <span className='text-[10px]'>FU Name: {fullUnitName}</span>
          <span className='text-[10px]'>
            Unit Type:{unitType ? unitType : 'NULL'}
          </span>
        </p>
      </button>
    </label>
  );
}
