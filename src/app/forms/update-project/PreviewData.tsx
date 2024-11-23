import { useOnboardingDataStore } from './useOnboardingDataStore';
import { useTowerUnitStore } from './useTowerUnitStore';

export default function PreviewData() {
  const { onboardingData } = useOnboardingDataStore();
  const { towerFormData } = useTowerUnitStore();
  return (
    <div className='grid grid-cols-2 gap-5'>
      <div>
        <h2 className='my-5 text-center text-xl font-semibold'>
          Preview Project Data
        </h2>
        <pre className='max-h-[500px] overflow-y-auto overflow-x-hidden whitespace-break-spaces bg-gray-200 px-5 font-mono text-sm'>
          {JSON.stringify(onboardingData, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className='my-5 text-center text-xl font-semibold'>
          Preview Tower Data
        </h2>
        <pre className='max-h-[500px] overflow-y-auto bg-gray-200 font-mono text-sm'>
          {JSON.stringify(towerFormData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
