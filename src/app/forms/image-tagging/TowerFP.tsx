import { nanoid } from 'nanoid';
import { TowerFloorDataType } from './page';

type TowerFPProps = {
  towerFloorData: TowerFloorDataType[];
};

export default function TowerFP({ towerFloorData }: TowerFPProps) {
  return (
    <>
      {towerFloorData?.map((tower, towerIndex) => (
        <div
          className='tower-card mb-14 flex w-full flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(0,60,255,0.5)]'
          key={nanoid()}
          id={nanoid()}
        >
          <p className='flex justify-evenly text-center font-semibold'>
            <span>Tower ID: {tower.towerId}</span>{' '}
            <span>Tower Name: {tower.towerName}</span>
            <span>Tower Type: {tower.towerType}</span>
          </p>
          <label className='relative flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[3] text-xl'>Select File:</span>
            <input
              type='file'
              multiple
              accept='image/*,.pdf'
              name={tower.towerId.toString()}
              className='file-input file-input-bordered h-10 flex-[5]'
            />
          </label>
        </div>
      ))}
    </>
  );
}
