import { cn } from '@/lib/utils';
import Section1Container from './section-1/Section1Container';
import Section2Container from './section-2/Section2Container';

export default function Page() {
  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>Error Form</h1>
      <div
        className={cn(
          'mb-40 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        )}
        id='error-form'
      >
        <Section1Container />
        <Section2Container />
      </div>
    </div>
  );
}
