import { useTowerUnitStore } from '../../useTowerUnitStore';
import Booking from './Booking';
import ConstructionStatus from './ConstructionStatus';
import Pricing from './Pricing';

export default function StatusContainer() {
  const { towerFormData } = useTowerUnitStore();
  const towerOptions = towerFormData.map((item) => ({
    label: `${item.tower_id}:${item.towerNameETL}`,
    value: item.tower_id,
  }));
  return (
    <div className='flex flex-col gap-4'>
      <Pricing towerOptions={towerOptions} />
      <Booking towerOptions={towerOptions} />
      <ConstructionStatus towerOptions={towerOptions} />
    </div>
  );
}
