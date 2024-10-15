'use client';

import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { nanoid } from 'nanoid';
import { BiPlus } from 'react-icons/bi';
import UnitSection from './UnitSection';
import { useTowerUnitStore } from '../../useTowerUnitStore';

export default function TowerPage() {
  const {
    copyUnitCard,
    addNewUnitCard,
    updateUnitCard,
    updateTowerFormData,
    towerFormData,
  } = useTowerUnitStore();
  return (
    <div>
      <label className='mb-5 flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Tower Card Count:</span>
        <input className={inputBoxClass} type='number' min={1} />
      </label>
      {towerFormData.map((tower) => (
        <div
          className='tower-card-container relative flex flex-col transition-all duration-1000'
          key={tower.id}
        >
          <div className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'>
            <span className='text-center font-semibold'>
              Tower Card id: {tower.id}
            </span>
            <button
              className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
              type='button'
            >
              ✕
            </button>
            <h3 className='my-4 text-2xl font-semibold'>
              Section: Tower Details
            </h3>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Project Phase:</span>
              <input
                className={inputBoxClass}
                name='projectPhase'
                type='number'
                min={1}
                defaultValue={tower.projectPhase}
                onChange={(e) =>
                  updateTowerFormData(tower.id, {
                    projectPhase: +e.target.value,
                  })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Rera ID:</span>
              <input
                className={inputBoxClass}
                defaultValue={tower.reraId}
                onChange={(e) =>
                  updateTowerFormData(tower.id, { reraId: e.target.value })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Tower Type:</span>
              <input
                className={inputBoxClass}
                defaultValue={tower.towerType}
                onChange={(e) => {
                  updateTowerFormData(tower.id, { towerType: e.target.value });
                  console.log({ towerFormData });
                }}
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Display Tower Type:</span>
              <div className='flex flex-[5]'>
                <Select
                  className='w-full flex-1'
                  name='projectSubType1'
                  instanceId={nanoid()}
                  options={[
                    { label: 'APARTMENT', value: 'APARTMENT' },
                    { label: 'VILLA', value: 'VILLA' },
                  ]}
                  defaultValue={tower.displayTowerType}
                  onChange={(e) =>
                    updateTowerFormData(tower.id, { displayTowerType: e })
                  }
                />
              </div>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex flex-[2] items-center'>
                <span>RERA Tower ID:</span>
              </span>
              <input
                className={inputBoxClass}
                name='towerName'
                defaultValue={tower.reraTowerId}
                onChange={(e) =>
                  updateTowerFormData(tower.id, { reraTowerId: e.target.value })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex flex-[2] items-center'>
                <span>Tower Name Display:</span>
              </span>
              <input
                className={inputBoxClass}
                name='towerNameDisplay'
                defaultValue={tower.towerNameDisplay}
                onChange={(e) =>
                  updateTowerFormData(tower.id, {
                    towerNameDisplay: e.target.value,
                  })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex flex-[2] items-center'>
                <span>Tower Name ETL:</span>
              </span>
              <input
                className={inputBoxClass}
                name='towerNameETL'
                defaultValue={tower.towerNameETL}
                onChange={(e) =>
                  updateTowerFormData(tower.id, {
                    towerNameETL: e.target.value,
                  })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Tower Door No String:</span>
              <input
                className={inputBoxClass}
                defaultValue={tower.towerDoorNoString}
                onChange={(e) =>
                  updateTowerFormData(tower.id, {
                    towerDoorNoString: e.target.value,
                  })
                }
              />
            </label>
            <div className='absolute -bottom-6 -left-5 z-10 w-full'>
              <button
                type='button'
                className='btn btn-md mx-auto flex items-center border-none bg-violet-300 hover:bg-violet-400'
              >
                <BiPlus size={30} /> <span>Duplicate</span>
              </button>
            </div>
            <UnitSection
              unitCards={tower.unitCards}
              updateUnitCard={updateUnitCard}
              towerId={tower.id}
              copyUnitCard={copyUnitCard}
              addNewUnitCard={addNewUnitCard}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
