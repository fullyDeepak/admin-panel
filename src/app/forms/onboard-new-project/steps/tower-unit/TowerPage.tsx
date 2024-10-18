'use client';

import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { nanoid } from 'nanoid';
import { BiCopy } from 'react-icons/bi';
import UnitSection from './UnitSection';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

export default function TowerPage() {
  const {
    copyUnitCard,
    addNewUnitCard,
    updateUnitCard,
    updateTowerFormData,
    towerFormData,
    addNewTowerCard,
    deleteTowerCard,
    setTowerFormData,
    deleteUnitCard,
    setExistingUnitTypeOption,
    duplicateTowerCard,
  } = useTowerUnitStore();
  const [towerCardCount, setTowerCardCount] = useState<number>(0);
  useEffect(() => {
    let options: {
      label: string;
      value: string;
    }[] = [];
    towerFormData.map((tower) => {
      tower.unitCards.map((unitCard) => {
        options.push({
          label: `T${tower.id}:U${unitCard.id}`,
          value: `T${tower.id}:U${unitCard.id}`,
        });
      });
    });
    setExistingUnitTypeOption(options);
  }, [towerFormData]);

  return (
    <div>
      <label className='mx-auto mb-5 flex max-w-[600px] flex-wrap items-center justify-between gap-5'>
        <input
          placeholder='Enter Tower Card Count'
          className={cn(inputBoxClass, 'max-w-[220px]')}
          type='number'
          value={towerCardCount || ''}
          onChange={(e) => setTowerCardCount(+e.target.value)}
          min={1}
        />
        <button
          className='flex size-10 items-center justify-center rounded-full bg-cyan-400'
          onClick={() => setTowerCardCount(towerCardCount + 1)}
        >
          <Plus strokeWidth={3} />
        </button>
        <button
          className='flex size-10 items-center justify-center rounded-full bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => setTowerCardCount(towerCardCount - 1)}
          disabled={towerCardCount === 0}
        >
          <Minus strokeWidth={3} />
        </button>
        <button
          onClick={() => {
            setTowerFormData([]);
            if (towerCardCount > 0) {
              Array.from({ length: towerCardCount }).forEach(() =>
                addNewTowerCard()
              );
            }
          }}
          className='btn-rezy flex-[2]'
          disabled={towerCardCount === 0}
        >
          {towerFormData.length === 0
            ? 'Generate Tower Card'
            : 'Delete and Regenerate Tower Card'}
        </button>
      </label>
      {towerFormData.map((tower) => (
        <div
          className='tower-card-container relative z-0 flex flex-col transition-all duration-1000'
          key={tower.id}
        >
          <div className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'>
            <span className='text-center font-semibold'>
              Tower Card id: {tower.id}
            </span>
            <button
              className='absolute right-2 top-2 m-2 size-10 rounded-full font-semibold hover:bg-gray-300'
              type='button'
              onClick={() => {
                confirm('Are you sure?') && deleteTowerCard(tower.id);
              }}
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
              <div className='flex flex-[5]'>
                <Select
                  className='w-full flex-1'
                  name='projectSubType1'
                  instanceId={nanoid()}
                  options={[
                    { label: 'Apartment', value: 'apartment' },
                    { label: 'Apartment-Single', value: 'apartmentSingle' },
                    { label: 'Villa', value: 'villa' },
                    { label: 'Mixed', value: 'mixed' },
                  ]}
                  defaultValue={tower.towerType}
                  onChange={(e) =>
                    updateTowerFormData(tower.id, { towerType: e })
                  }
                />
              </div>
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
            <label className='flex flex-wrap items-center justify-start gap-5'>
              <span className='flex flex-1 items-center'>
                <span>Single Unit:</span>
              </span>
              <input
                className='toggle toggle-success border-2'
                name='singleUnit'
                type='checkbox'
                defaultChecked={tower.singleUnit}
                onChange={(e) =>
                  updateTowerFormData(tower.id, {
                    singleUnit: e.target.checked,
                  })
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
            <div className='absolute -bottom-6 -left-5 w-full'>
              <button
                type='button'
                className='btn btn-md mx-auto flex items-center border-none bg-violet-300 hover:bg-violet-400'
                onClick={() => {
                  duplicateTowerCard(tower.id);
                }}
              >
                <BiCopy size={30} /> <span>Duplicate</span>
              </button>
            </div>
            <UnitSection
              unitCards={tower.unitCards}
              updateUnitCard={updateUnitCard}
              towerId={tower.id}
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
