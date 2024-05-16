import { inputBoxClass } from '@/app/constants/tw-class';
import { FormTowerDetailType } from '@/types/types';

type ProjectMatcherProps = {
  towerFormData: FormTowerDetailType;
  updateTowerFormData: (
    id: number,
    key: keyof FormTowerDetailType,
    value: any
  ) => void;
};

export default function TowerMatcherSection({
  towerFormData,
  updateTowerFormData,
}: ProjectMatcherProps) {
  return (
    <section>
      <h3 className='my-4 text-2xl font-semibold'>Section: Matcher Data</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex flex-[2] items-center  '>
          <span>Tower Door No. String:</span>
        </span>
        <input
          className={inputBoxClass}
          name='towerDoorNo'
          defaultValue={towerFormData.towerDoorNo}
          onChange={(e) =>
            updateTowerFormData(towerFormData.id, 'towerDoorNo', e.target.value)
          }
        />
      </label>
    </section>
  );
}
