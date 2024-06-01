import { useImageFormStore } from '@/store/useImageFormStore';
import { nanoid } from 'nanoid';

type UnitCellProps = {
  towerId: number;
  floorId: number;
  unitName: string;
  selectedUnits: string[];
};

export default function UnitCell({
  floorId,
  towerId,
  unitName,
  selectedUnits,
}: UnitCellProps) {
  console.log('UnitCell.tsx re-renders...');
  const { setSelectedUnit } = useImageFormStore();
  return (
    <label className='swap'>
      <input
        type='checkbox'
        key={nanoid()}
        checked={Boolean(selectedUnits.includes(unitName))}
        onChange={(e) => {
          setSelectedUnit({
            towerId: towerId,
            floorId: floorId,
            unitName: unitName,
          });
        }}
      />
      <p
        key={nanoid()}
        className='swap-on min-w-32 rounded-full border bg-green-200 px-4 py-2 text-center text-sm'
      >
        {unitName}
      </p>
      <p
        key={nanoid()}
        className='swap-off min-w-32 rounded-full border px-4 py-2 text-center text-sm'
      >
        {unitName}
      </p>
    </label>
  );
}
