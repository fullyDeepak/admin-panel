import { UnitCardDataToPost } from '../../types';
import { useTowerUnitStore } from '../../useTowerUnitStore';

type Props = {
  UnitCardDataToPost: UnitCardDataToPost[];
};

export default function PreviewContainer({ UnitCardDataToPost }: Props) {
  const {
    towerFormData,
    projectBookingStatus,
    projectPricingStatus,
    projectConstructionStatus,
  } = useTowerUnitStore();
  return (
    <div className='mt-10'>
      <div className='grid grid-cols-2 gap-5'>
        <div>
          <h2 className='text-center text-xl font-semibold'>
            Tower Unit Cards Data
          </h2>
          <pre className='max-h-[500px] w-full overflow-y-auto bg-gray-100 p-2 font-mono text-xs'>
            {JSON.stringify(towerFormData, null, 2)}
          </pre>
        </div>
        <div>
          {UnitCardDataToPost?.length > 0 && (
            <>
              <h2 className='text-center text-xl font-semibold'>
                Posted Tower Unit Cards Data
              </h2>
              <pre className='max-h-[500px] w-full overflow-y-auto bg-gray-100 p-2 font-mono text-xs'>
                {JSON.stringify(UnitCardDataToPost, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
      <div className='mt-10 grid grid-cols-3 gap-5'>
        <div>
          <h2 className='text-center text-xl font-semibold'>Pricing Data</h2>
          <pre className='max-h-[500px] w-full overflow-y-auto bg-gray-100 p-2 font-mono text-xs'>
            {JSON.stringify(projectPricingStatus, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className='text-center text-xl font-semibold'>Booking Data</h2>
          <pre className='max-h-[500px] w-full overflow-y-auto bg-gray-100 p-2 font-mono text-xs'>
            {JSON.stringify(projectBookingStatus, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className='text-center text-xl font-semibold'>
            Construction Data
          </h2>
          <pre className='max-h-[500px] w-full overflow-y-auto bg-gray-100 p-2 font-mono text-xs'>
            {JSON.stringify(projectConstructionStatus, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
