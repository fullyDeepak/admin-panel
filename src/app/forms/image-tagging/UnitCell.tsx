import { useImageFormStore } from '@/store/useImageFormStore';
import { nanoid } from 'nanoid';

type UnitCellProps = {
  towerId: number;
  unitName: string;
  unitType: number;
};

export default function UnitCell({
  towerId,
  unitName,
  unitType,
}: UnitCellProps) {
  //   console.log('UnitCell.tsx re-renders...');
  const { setSelectedUnit, selectedTFUData } = useImageFormStore();
  const existingUnitType = selectedTFUData[towerId]['selectedUnits'][unitName];
  return (
    <label className='swap'>
      <input
        type='checkbox'
        key={nanoid()}
        checked={existingUnitType === null ? false : true}
        onChange={(e) => {
          setSelectedUnit({
            towerId: towerId,
            unitName: unitName,
            unitType: unitType,
          });
        }}
      />
      <div
        key={nanoid()}
        className='swap-on min-w-32 rounded-full border bg-green-200 px-4 py-2 text-center text-sm'
      >
        <p className='flex flex-col'>
          <span>{unitName}</span>
          <span className='text-[10px]'>
            Unit Type:{existingUnitType ? existingUnitType : 'NULL'}
          </span>
        </p>
      </div>
      <div
        key={nanoid()}
        className='swap-off min-w-32 rounded-full border px-4 py-2 text-center text-sm'
      >
        <p className='flex flex-col'>
          <span>{unitName}</span>
          <span className='text-[10px]'>
            Unit Type:{existingUnitType ? existingUnitType : 'NULL'}
          </span>
        </p>
      </div>
    </label>
  );
}
