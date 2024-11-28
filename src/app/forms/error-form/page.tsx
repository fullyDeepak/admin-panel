import Section1Container from './section-1/Section1Container';
import Section2Container from './section-2/Section2Container';
import Section3Container from './section-3/Section3Container';

export default function Page() {
  return (
    <div className='mx-auto mb-80 mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>Error Form</h1>
      <Section1Container />
      <Section2Container />
      <Section3Container />
    </div>
  );
}
