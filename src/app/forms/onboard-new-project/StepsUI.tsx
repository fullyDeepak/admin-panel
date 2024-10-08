import { cn } from '@/lib/utils';
import React from 'react';

type Props<T> = {
  stepValue: T;
};

export default function StepsUI<T>({ stepValue }: Props<T>) {
  const steps = ['Step 1', 'Step 2', 'Preview'] as const;

  return (
    <div className='mx-auto flex w-full items-center justify-center'>
      <ul className='steps w-[90%]'>
        {steps.map((step, index) => (
          <li
            key={index}
            className={cn(
              stepValue === step ? 'step step-secondary' : 'step',
              steps.findIndex((s) => s === stepValue) > index
                ? 'step-secondary'
                : ''
            )}
            data-content={
              steps.findIndex((s) => s === stepValue) > index ? '✓' : index + 1
            }
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
