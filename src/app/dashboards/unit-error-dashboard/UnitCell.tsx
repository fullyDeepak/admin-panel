import { getRandomColor } from '@/lib/utils';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

type UnitCellProps = {
  towerId: number;
  floorNumber: number;
  fullUnitName: string;
  unitNumber: string;
  unitType: number;
};

export default function UnitCell({
  towerId,
  floorNumber,
  fullUnitName,
  unitNumber,
  unitType,
}: UnitCellProps) {
  let color = '';
  if (unitType) {
    color = getRandomColor(unitType);
  }
  return (
    <label className='swap'>
      <button
        id={nanoid()}
        style={{
          backgroundColor: color ? color : '#e4e4e4',
          opacity: color ? 1 : 0.6,
        }}
        className='min-w-32 rounded-full border px-4 py-2 text-center text-sm hover:brightness-90 disabled:cursor-not-allowed'
        type='button'
        onClick={() => {
          if (unitType === 1) {
            toast.success('Unit is clean. 🎉');
          } else {
            toast.error('Building 👷‍♂️ Matcher Form v2');
          }
        }}
      >
        <p className='flex flex-col leading-4'>
          <span>
            {floorNumber}-{unitNumber}
          </span>
          <span className='text-[10px]'>FU Name: {fullUnitName}</span>
          <span className='text-[10px]'>
            {/* unitItem.nameMismatch
                              ? 10
                              : unitItem.noHM
                                ? 20
                                : unitItem.noTM
                                  ? 30
                                  : 1 */}

            {unitType === 1
              ? 'Clean'
              : unitType === 10
                ? 'Name Mismatch'
                : unitType === 20
                  ? 'No HM'
                  : unitType === 30
                    ? 'No TM'
                    : 'NULL'}
          </span>
        </p>
      </button>
    </label>
  );
}
