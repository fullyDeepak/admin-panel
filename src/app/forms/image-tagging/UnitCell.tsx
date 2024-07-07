import { nanoid } from 'nanoid';

type UnitCellProps = {
  towerId: number;
  unitName: string;
  unitType: number | null;
  color?: string;
};

export default function UnitCell({ unitName, unitType, color }: UnitCellProps) {
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
          alert(`You clicked on Unit:${unitName} and Unit Type:${unitType}`)
        }
        type='button'
      >
        <p className='flex flex-col'>
          <span>{unitName}</span>
          <span className='text-[10px]'>
            Unit Type:{unitType ? unitType : 'NULL'}
          </span>
        </p>
      </button>
    </label>
  );
}
