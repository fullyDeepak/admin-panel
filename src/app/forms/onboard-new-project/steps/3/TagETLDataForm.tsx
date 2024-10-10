import ETLTagData from './ETLTagData';
import ProjectMatcherSection from './ProjectMatcherSection';

export function TagETLDataForm() {
  return (
    <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <ProjectMatcherSection />
      <ETLTagData isUpdateForm={true} />
    </div>
  );
}
