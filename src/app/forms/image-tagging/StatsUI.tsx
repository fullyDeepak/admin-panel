import { cn } from '@/lib/utils';
import { ImageStatsData } from '@/types/types';
import { range, startCase } from 'lodash';

type Props = {
  data: ImageStatsData | null;
  isLoading: boolean;
};

export default function StatsUI({ data, isLoading }: Props) {
  function getUnitBgColor(towerUnitItem: {
    tower_id: number;
    tower_name: string;
    tower_docs: string[] | null;
    total_unit_count: number;
    tagged_unit_count: number;
  }) {
    const total_unit_count = towerUnitItem.total_unit_count;
    const tagged_unit_count = towerUnitItem.tagged_unit_count;
    const tower_docs = towerUnitItem.tower_docs;
    if (
      tagged_unit_count > 0 &&
      total_unit_count > 0 &&
      tagged_unit_count >= total_unit_count
    ) {
      return 'bg-green-300';
    } else if (
      tower_docs &&
      tower_docs?.length > 0 &&
      tagged_unit_count === 0
    ) {
      return 'bg-green-300';
    } else {
      return 'bg-red-300';
    }
  }
  return (
    <div className='flex w-full justify-between'>
      <div className='flex flex-col items-center'>
        <h2 className='my-4 text-xl'>Project Stats</h2>
        <div className='flex flex-col overflow-hidden rounded-2xl border-2 border-t-2 tabular-nums shadow-darkC'>
          <div className='flex gap-5 bg-base-200 py-2 font-semibold'>
            <div className='w-40 text-center'>Docs Type</div>
            <div className='w-40 text-center'>Docs Count</div>
          </div>
          {isLoading && (
            <>
              <div className='flex items-center gap-5 border-b-2 last:border-b-0'>
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  Brochure
                </div>
                <div className='skeleton ml-8 h-5 w-24'></div>
              </div>
              <div className='flex items-center gap-5 border-b-2 last:border-b-0'>
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  Project Image
                </div>
                <div className='skeleton ml-8 h-5 w-24'></div>
              </div>
              <div className='flex items-center gap-5 border-b-2 last:border-b-0'>
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  Project Master Plan
                </div>
                <div className='skeleton ml-8 h-5 w-24'></div>
              </div>
            </>
          )}
          {!isLoading &&
            data?.project_res &&
            Object.entries(data.project_res).map(([docsType, urls]) => (
              <div
                className={cn(
                  'flex items-center gap-5 border-b-2 last:border-b-0',
                  !isLoading && urls.length > 0 ? 'bg-green-300' : 'bg-red-300',
                  isLoading && 'bg-transparent'
                )}
                key={docsType}
              >
                <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  {startCase(docsType)}
                </div>
                {!isLoading && (
                  <div className='h-12 w-40 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                    {urls.length ? urls.length : 'N/A'}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <h2 className='my-4 text-xl'>Tower and Unit Stats</h2>
        <div className='flex flex-col overflow-hidden rounded-2xl border-2 border-t-2 tabular-nums shadow-darkC'>
          <div className='flex gap-3 bg-base-200 px-5 py-2 font-semibold'>
            <div className='w-24 text-center'>Tower Id</div>
            <div className='w-36 text-center'>Tower Name</div>
            <div className='w-24 text-center'>Tower Plan</div>
            <div className='w-24 text-center'>Unit Plan</div>
          </div>
          {isLoading &&
            range(4).map((item) => (
              <div
                className='flex items-center gap-3 border-b-2 px-5 py-2 last:border-b-0'
                key={item}
              >
                <div className='skeleton h-5 w-24 text-center leading-[48px]'></div>
                <div className='skeleton h-5 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'></div>
                <div className='skeleton h-5 w-24 text-center leading-[48px]'></div>
                <div className='skeleton h-5 w-24 text-center leading-[48px]'></div>
              </div>
            ))}
          {!isLoading &&
            data?.tower_unit_res.map((towerUnitItem) => (
              <div
                className='flex items-center gap-3 border-b-2 px-5 last:border-b-0'
                key={towerUnitItem.tower_id}
              >
                <div className='h-12 w-24 text-center leading-[48px]'>
                  {towerUnitItem.tower_id}
                </div>
                <div className='h-12 w-36 overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[48px]'>
                  {towerUnitItem.tower_name}
                </div>
                <div
                  className={`h-12 w-24 text-center leading-[48px] ${towerUnitItem?.tower_docs && towerUnitItem.tower_docs.length > 0 ? 'bg-green-300' : 'bg-red-300'}`}
                >
                  {towerUnitItem.tower_docs?.length
                    ? towerUnitItem.tower_docs?.length
                    : 'N/A'}
                </div>
                <div
                  className={cn(
                    'h-12 w-24 text-center leading-[48px]',
                    getUnitBgColor(towerUnitItem)
                  )}
                >{`${towerUnitItem.tagged_unit_count}/${towerUnitItem.total_unit_count}`}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
