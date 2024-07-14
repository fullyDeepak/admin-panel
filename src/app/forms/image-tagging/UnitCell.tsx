import { nanoid } from 'nanoid';

type UnitCellProps = {
  towerId: number;
  floorNumber: number;
  fullUnitName: string;
  unitNumber: string;
  unitType: number | null;
  color?: string;
};

export default function UnitCell({
  towerId,
  floorNumber,
  fullUnitName,
  unitNumber,
  unitType,
  color,
}: UnitCellProps) {
  return (
    <label className='swap'>
      <button
        key={nanoid()}
        style={{
          backgroundColor: color ? color : '#e4e4e4',
          opacity: color ? 1 : 0.6,
        }}
        className='min-w-32 rounded-full border px-4 py-2 text-center text-sm'
        onClick={() =>
          alert(
            `You clicked on tower:${towerId}, Unit Number:${unitNumber}, Full Unit Name:${fullUnitName} and Unit Type:${unitType}`
          )
        }
        type='button'
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
