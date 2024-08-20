import { inputBoxClass } from '@/app/constants/tw-class';
import { useTowerStoreRera } from './useTowerStoreRera';
import { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import Select, { SingleValue } from 'react-select';
import { useProjectStoreRera } from './useProjectStoreRera';
import TowerUnitDetails from '@/components/forms/TowerUnitDetails';
import ETLTagConfiguration from '@/components/forms/ETLTagConfiguration';
import TowerMatcherSection from '@/components/forms/TowerMatcherSection';
import { nanoid } from 'nanoid';

export default function TowerForm() {
  const {
    towerFormDataRera,
    updateTowerFormDataRera,
    deleteTowerFormDataRera,
    addNewTowerDataRera,
    addEtlUnitConfigRera,
    deleteEtlUnitConfigRera,
    updateEtlUnitConfigRera,
  } = useTowerStoreRera();
  const { projectFormDataRera } = useProjectStoreRera();
  const [isApartmentSingle, setIsApartmentSingle] = useState<boolean>(false);

  useEffect(() => {
    if (towerFormDataRera[0].towerType?.value === 'apartmentSingle') {
      setIsApartmentSingle(true);
      const cardCount = towerFormDataRera.map((item) => item.id);
      while (cardCount.length !== 1) {
        const pop = cardCount.pop();
        if (pop) {
          deleteTowerFormDataRera(pop);
        }
      }
    } else {
      setIsApartmentSingle(false);
    }
  }, [towerFormDataRera[0].towerType?.value]);

  return (
    <div className='tower-card-container relative flex flex-col transition-all duration-1000'>
      {towerFormDataRera.map((tower) => (
        <div
          className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'
          key={tower.id}
        >
          <span className='text-center font-semibold'>Card id: {tower.id}</span>
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
            type='button'
            onClick={() => {
              if (towerFormDataRera.length > 1) {
                deleteTowerFormDataRera(tower.id);
              }
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
              defaultValue={tower.projectPhase}
              min={1}
              onChange={(e) =>
                updateTowerFormDataRera(
                  tower.id,
                  'projectPhase',
                  +e.target.value
                )
              }
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Rera ID:</span>
            <input
              className={inputBoxClass}
              name='reraId'
              defaultValue={tower.reraId}
              onChange={(e) =>
                updateTowerFormDataRera(tower.id, 'reraId', e.target.value)
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
                options={projectFormDataRera.towerTypeOptions}
                defaultValue={tower.towerType}
                onChange={(e: SingleValue<{ label: string; value: string }>) =>
                  updateTowerFormDataRera(tower.id, 'towerType', e)
                }
              />
              <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
                <span>{tower.towerTypeSuggestion}</span>
              </span>
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
                  { label: 'Apartment', value: 'Apartment' },
                  { label: 'Villa', value: 'Villa' },
                ]}
                onChange={(e: SingleValue<{ label: string; value: string }>) =>
                  updateTowerFormDataRera(tower.id, 'displayTowerType', e)
                }
              />
            </div>
          </label>
          {projectFormDataRera.isRERAProject && (
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex flex-[2] items-center'>
                <span>RERA Tower ID:</span>
              </span>
              <input
                className={inputBoxClass}
                name='towerName'
                defaultValue={tower.reraTowerId}
                onChange={(e) =>
                  updateTowerFormDataRera(
                    tower.id,
                    'reraTowerId',
                    e.target.value
                  )
                }
              />
            </label>
          )}
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Tower Name Alias:</span>
            </span>
            <input
              className={inputBoxClass}
              name='towerNameAlias'
              defaultValue={tower.towerNameAlias}
              onChange={(e) =>
                updateTowerFormDataRera(
                  tower.id,
                  'towerNameAlias',
                  e.target.value
                )
              }
            />
          </label>
          <ETLTagConfiguration
            addEtlUnitConfig={addEtlUnitConfigRera}
            deleteEtlUnitConfig={deleteEtlUnitConfigRera}
            towerData={tower}
            updateTowerData={updateTowerFormDataRera}
            updateETLUnitConfig={updateEtlUnitConfigRera}
          />
          <TowerUnitDetails
            towerData={tower}
            towersFormData={towerFormDataRera}
            updateTowerForm={updateTowerFormDataRera}
          />
          <TowerMatcherSection
            towerFormData={tower}
            updateTowerFormData={updateTowerFormDataRera}
          />
          {!isApartmentSingle && (
            <div className='absolute -bottom-6 -left-5 z-10 w-full'>
              <button
                type='button'
                className='btn btn-md mx-auto flex items-center border-none bg-violet-300 hover:bg-violet-400'
                onClick={() => {
                  const newData = {
                    ...tower,
                    id:
                      Math.max(...towerFormDataRera.map((data) => data.id)) + 1,
                    towerName: '',
                    reraTowerId: '',
                  };
                  addNewTowerDataRera(newData);
                }}
              >
                <BiPlus size={30} /> <span>Duplicate</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
