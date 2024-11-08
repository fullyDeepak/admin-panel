'use client';

import { useEffect } from 'react';

import { useTowerUnitStore } from '../../useTowerUnitStore';
import UnitSection from './UnitSection';
import RefTable from './RefTable';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function TowerSection() {
  const {
    copyUnitCard,
    addNewUnitCard,
    updateUnitCard,
    updateTowerFormData,
    towerFormData,
    // deleteTowerCard,
    // setTowerFormData,
    deleteUnitCard,
    setExistingUnitTypeOption,
  } = useTowerUnitStore();

  useEffect(() => {
    let options: {
      label: string;
      value: string;
    }[] = [];
    towerFormData.map((tower) => {
      tower.unitCards.map((unitCard) => {
        options.push({
          label: `T${tower.tower_id}:U${unitCard.id}`,
          value: `T${tower.tower_id}:U${unitCard.id}`,
        });
      });
    });
    setExistingUnitTypeOption(options);
  }, [towerFormData]);

  return (
    <div className='flex flex-col text-sm'>
      {towerFormData.map((tower, idx) => (
        <div
          className='tower-card-container relative z-0 flex flex-col transition-all duration-1000'
          key={tower.tower_id}
          id={`tower-card-${tower.tower_id}`}
        >
          <div className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'>
            <div className='flex w-full items-center justify-around'>
              <div className='flex items-center gap-4'>
                <button
                  className='tooltip flex !size-10 items-center justify-center rounded-full border-2 border-neutral duration-200 hover:bg-gray-200 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => {
                    const cardIdx = towerFormData.findIndex(
                      (item) => item.tower_id === tower.tower_id
                    );
                    if (cardIdx === 0) return;
                    const gotoIdx = towerFormData[0].tower_id;
                    document
                      .getElementById(`tower-card-${gotoIdx}`)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-tip='Go to First Tower Card'
                  disabled={idx === 0}
                >
                  <ChevronFirst />
                </button>
                <button
                  className='tooltip flex !size-10 items-center justify-center rounded-full border-2 border-neutral duration-200 hover:bg-gray-200 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => {
                    const cardIdx = towerFormData.findIndex(
                      (item) => item.tower_id === tower.tower_id
                    );
                    if (cardIdx === 0) return;
                    const gotoIdx = towerFormData[cardIdx - 1].tower_id;
                    document
                      .getElementById(`tower-card-${gotoIdx}`)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-tip='Go to Previous Tower Card'
                  disabled={idx === 0}
                >
                  <ChevronLeft />
                </button>
              </div>
              <span className='text-center text-xl font-semibold'>
                Tower Card id: {tower.tower_id}
              </span>
              <div className='flex items-center gap-4'>
                <button
                  className='tooltip flex !size-10 items-center justify-center rounded-full border-2 border-neutral duration-200 hover:bg-gray-200 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => {
                    const cardIdx = towerFormData.findIndex(
                      (item) => item.tower_id === tower.tower_id
                    );
                    const gotoIdx = towerFormData[cardIdx + 1].tower_id;
                    document
                      .getElementById(`tower-card-${gotoIdx}`)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={idx === towerFormData.length - 1}
                  data-tip='Go to Next Tower Card'
                >
                  <ChevronRight />
                </button>
                <button
                  className='tooltip flex !size-10 items-center justify-center rounded-full border-2 border-neutral duration-200 hover:bg-gray-200 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => {
                    const gotoIdx =
                      towerFormData[towerFormData.length - 1].tower_id;
                    document
                      .getElementById(`tower-card-${gotoIdx}`)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-tip='Go to Last Tower Card'
                  disabled={idx === towerFormData.length - 1}
                >
                  <ChevronLast />
                </button>
              </div>
            </div>
            <h3 className='my-4 text-2xl font-semibold'>
              Section: Tower Details
            </h3>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3]'>ETL Tower ID & Name:</span>
              <span className='ml-[6px] min-h-9 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
                <span>{`${tower.tower_id} : ${tower.towerNameETL}`}</span>
              </span>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3]'>RERA ID and RERA Tower ID:</span>
              <span className='ml-[6px] min-h-9 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
                <span>{`${tower.reraId} : ${tower.reraTowerId}`}</span>
              </span>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3]'>Tower Floor Plan:</span>
              <input
                type='file'
                className='file-input file-input-bordered file-input-accent ml-2 h-10 flex-[5]'
                multiple
                disabled
                accept='image/*'
              />
            </div>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3]'>Typical Floor:</span>
              <div className='flex flex-[5] items-center gap-2'>
                <div className='float-label-input-group relative w-[150px]'>
                  <input
                    type='number'
                    defaultValue={
                      tower.typicalMaxFloor ? tower.typicalMaxFloor : ''
                    }
                    onChange={(e) =>
                      updateTowerFormData(tower.tower_id, {
                        typicalMaxFloor: +e.target.value,
                      })
                    }
                    id='max-floor'
                    placeholder=''
                    className='group peer w-full flex-[5] rounded-md border-0 bg-transparent p-2 pt-4 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  />
                  <label
                    className='absolute left-2 top-3 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-3 peer-focus:bg-white peer-focus:px-2 peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-violet-500'
                    htmlFor='max-floor'
                  >
                    Max Floor
                  </label>
                </div>
                <div className='float-label-input-group relative'>
                  <input
                    type='text'
                    defaultValue={tower.typicalUnitCount}
                    id='unit-count'
                    onChange={(e) =>
                      updateTowerFormData(tower.tower_id, {
                        typicalUnitCount: e.target.value,
                      })
                    }
                    placeholder=''
                    className='group peer w-full flex-[5] rounded-md border-0 bg-transparent p-2 pt-4 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  />
                  <label
                    className='absolute left-2 top-3 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-3 peer-focus:bg-white peer-focus:px-2 peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-violet-500'
                    htmlFor='unit-count'
                  >
                    Unit Count
                  </label>
                </div>
              </div>
            </div>
            <div className='relative flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3]'>Ground Floor:</span>
              <div className='flex flex-[5] items-center gap-2'>
                <div className='float-label-input-group relative w-[150px]'>
                  <input
                    type='text'
                    defaultValue={tower.gfName}
                    id='ground-floor-name'
                    onChange={(e) =>
                      updateTowerFormData(tower.tower_id, {
                        gfName: e.target.value,
                      })
                    }
                    placeholder=''
                    className='group peer w-full flex-[5] rounded-md border-0 bg-transparent p-2 pt-4 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  />
                  <label
                    className='absolute left-2 top-3 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-3 peer-focus:bg-white peer-focus:px-2 peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-violet-500'
                    htmlFor='ground-floor-name'
                  >
                    Ground Floor Name
                  </label>
                </div>
                <div className='float-label-input-group relative'>
                  <input
                    type='text'
                    defaultValue={tower.gfUnitCount}
                    id='gf-unit-count'
                    onChange={(e) =>
                      updateTowerFormData(tower.tower_id, {
                        gfUnitCount: e.target.value,
                      })
                    }
                    placeholder=''
                    className='group peer w-full flex-[5] rounded-md border-0 bg-transparent p-2 pt-4 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
                  />
                  <label
                    className='absolute left-2 top-3 cursor-text py-0 text-gray-500 transition-all duration-300 peer-focus:-top-3 peer-focus:bg-white peer-focus:px-2 peer-focus:text-violet-500 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-violet-500'
                    htmlFor='gf-unit-count'
                  >
                    Unit Count
                  </label>
                </div>
              </div>
              <button
                disabled
                className='btn btn-warning absolute -top-6 right-0'
              >
                Generate Grid
              </button>
            </div>
            <RefTable
              reraRefTable={tower.reraRefTable}
              tmRefTable={tower.tmRefTable}
            />
            <UnitSection
              unitCards={tower.unitCards}
              updateUnitCard={updateUnitCard}
              towerId={tower.tower_id}
              copyUnitCard={copyUnitCard}
              addNewUnitCard={addNewUnitCard}
              deleteUnitCard={deleteUnitCard}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
