import { useProjectStore } from '@/store/useProjectStore';
import { useTowerStore } from '@/store/useTowerStore';

export default function PreviewProjectTower() {
  const { projectFormData } = useProjectStore();
  const { towerFormData } = useTowerStore();
  let newProjectFormData: any;
  newProjectFormData = { ...projectFormData };
  delete newProjectFormData.towerTypeOptions;
  delete newProjectFormData.projectSubTypeOptions;
  newProjectFormData.village_id = newProjectFormData.village_id?.value;
  newProjectFormData.projectType = newProjectFormData.projectType?.value;
  newProjectFormData.projectSubType = newProjectFormData.projectSubType?.value;

  let newTowerFormData: any;
  newTowerFormData = towerFormData.map((item) => ({
    ...item,
    towerType: item.towerType?.value,
  }));
  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Project Data</p>
        <textarea className='h-80 w-full bg-slate-100 p-5 font-mono'>
          {JSON.stringify(newProjectFormData)}
        </textarea>
      </div>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Tower Data</p>
        <textarea className='h-80 w-full bg-slate-100 p-5 font-mono'>
          {JSON.stringify(newTowerFormData)}
        </textarea>
      </div>
    </div>
  );
}
