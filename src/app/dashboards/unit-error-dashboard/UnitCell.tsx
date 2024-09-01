import { getRandomColor } from '@/lib/utils';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

type UnitCellProps = {
  towerId: number;
  floorNumber: number;
  fullUnitName: string;
  unitNumber: string;
  unitType: number | null;
  shouldColor?: boolean;
};

export default function UnitCell({
  towerId,
  floorNumber,
  fullUnitName,
  unitNumber,
  unitType,
  shouldColor,
}: UnitCellProps) {
  let color =
    unitType === 1
      ? '#4ade80'
      : unitType === 2
        ? '#fdba74'
        : unitType === 3
          ? '#f97316'
          : unitType === 4
            ? '#ea580c'
            : unitType === 5
              ? '#92522b'
              : unitType === 6
                ? '#633824'
                : '#e4e4e4';
  return (
    <label className='swap'>
      <button
        id={nanoid()}
        style={{
          backgroundColor: shouldColor
            ? unitType === 1
              ? '#4ade80'
              : unitType === 2
                ? '#fdba74'
                : unitType === 3
                  ? '#f97316'
                  : unitType === 4
                    ? '#eab308'
                    : unitType === 5
                      ? '#f87171'
                      : unitType === 6
                        ? '#f43f5e'
                        : '#e4e4e4'
            : '#e4e4e4',
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
            {/* unitItem.clean
                              ? 1
                              : unitItem.nameMismatch
                                ? 2
                                : unitItem.verifyPTIN
                                  ? 3
                                  : unitItem.noHM
                                    ? 4
                                    : unitItem.noTM
                                      ? 5
                                      : unitItem.missing
                                        ? 6
                                        : null */}

            {unitType === 1
              ? 'Clean'
              : unitType === 2
                ? 'Verify Name'
                : unitType === 3
                  ? 'Verify PTIN'
                  : unitType === 4
                    ? 'Tag HM'
                    : unitType === 5
                      ? 'Tag TM'
                      : unitType === 6
                        ? 'Missing'
                        : 'NULL'}
          </span>
        </p>
      </button>
    </label>
  );
}
