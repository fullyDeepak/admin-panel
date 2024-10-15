import { cn } from '@/lib/utils';

type Props<T> = {
  stepValue: T;
  steps: string[];
  setFormSteps: (_step: T) => void;
};

export default function StepsUI<T>({
  stepValue,
  steps,
  setFormSteps,
}: Props<T>) {
  return (
    <div className='mx-auto flex w-full items-center justify-center'>
      <ul className='steps w-[90%] text-sm'>
        {steps.map((step, index) => (
          <li
            key={index}
            className={cn(
              'step cursor-pointer',
              stepValue === step ? 'step-secondary' : '',
              steps.findIndex((s) => s === stepValue) > index
                ? 'step-secondary'
                : ''
            )}
            data-content={
              steps.findIndex((s) => s === stepValue) > index ? '✓' : index + 1
            }
            onClick={() => setFormSteps(step as T)}
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
