import { useTowerUnitStore } from '../../useTowerUnitStore';
import Booking from './Booking';
import ConstructionStatus from './ConstructionStatus';
import Pricing from './Pricing';
import SimpleTable from '@/components/tables/SimpleTable';

export default function StatusContainer() {
  const { towerFormData, existingStatusData } = useTowerUnitStore();
  const towerOptions = towerFormData.map((item) => ({
    label: `${item.tower_id}:${item.towerNameETL}`,
    value: item.tower_id,
  }));

  return (
    <div className='flex flex-col gap-4'>
      <div>
        {existingStatusData?.length > 0 ? (
          <>
            <h2 className='text-center text-2xl font-semibold'>
              Existing Status-Pricing Data
            </h2>
            <div>
              <SimpleTable
                columns={[
                  'Project Id',
                  'Tower Id',
                  'Updated At',
                  'Updated Field',
                  'Updated Value',
                ]}
                tableData={existingStatusData.map((item) =>
                  Object.values(item)
                )}
              />
            </div>
          </>
        ) : (
          <h2 className='text-center text-2xl font-semibold'>
            Status-Pricing data not available
          </h2>
        )}
      </div>
      <Pricing towerOptions={towerOptions} />
      <Booking towerOptions={towerOptions} />
      <ConstructionStatus towerOptions={towerOptions} />
    </div>
  );
}
