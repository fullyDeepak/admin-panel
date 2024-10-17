import PopCarousel from './PopCarousel';

type Props = {
  projectName: string;
  projectType: string | null;
};

export default function CustomPopup({ projectName, projectType }: Props) {
  return (
    <div className='flex flex-col gap-5'>
      <PopCarousel />
      <div>
        <span className='font-gsans font-semibold'>Project Name:</span>{' '}
        {projectName}
      </div>
      <div>
        <span className='font-gsans font-semibold'>Project Type:</span>{' '}
        {projectType || 'missing'}
      </div>
    </div>
  );
}
