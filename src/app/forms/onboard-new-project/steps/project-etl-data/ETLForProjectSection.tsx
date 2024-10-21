import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import ETLTagData from './ETLTagData';
import ReraDocs from './ReraDocs';

export default function ETLForProjectSection() {
  const { onboardingData } = useOnboardingDataStore();

  return (
    <div>
      {onboardingData.selectedReraProjects &&
        onboardingData.selectedReraProjects.length > 0 && (
          <div className='flex flex-col gap-y-4'>
            <ReraDocs />
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex flex-[2] items-center'>
                <span>Suggested Survey:</span>
              </span>
              <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
                <span>{onboardingData.suggestedSurvey.join(', ')}</span>
              </span>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex flex-[2] items-center'>
                <span>Suggested Plot:</span>
              </span>
              <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
                <span>{onboardingData.suggestedPlot.join(', ')}</span>
              </span>
            </label>
          </div>
        )}
      <ETLTagData />
    </div>
  );
}
