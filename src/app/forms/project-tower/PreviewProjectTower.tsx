import { useProjectStore } from '@/store/useProjectStore';
import { useTowerStore } from '@/store/useTowerStore';

export default function PreviewProjectTower() {
  const { projectFormData } = useProjectStore();
  const { towerFormData } = useTowerStore();
  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Project Data</p>
        <textarea className='h-80 w-full font-mono'>
          {JSON.stringify(projectFormData)}
        </textarea>
      </div>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Tower Data</p>
        <textarea className='h-80 w-full font-mono'>
          {JSON.stringify(towerFormData)}
        </textarea>
      </div>
    </div>
  );
}
