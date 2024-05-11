import { inputBoxClass } from '@/app/constants/tw-class';
import { useTowerStoreRera } from '@/store/useTowerStoreRera';
import { useEffect, useState } from 'react';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import Select, { SingleValue } from 'react-select';
import { useProjectStoreRera } from '@/store/useProjectStoreRera';
import TowerUnitDetails from '@/components/forms/TowerUnitDetails';
import ETLTagConfiguration from '@/components/forms/ETLTagConfiguration';

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
  const { projectFormDataRera, updateProjectFormDataRera } =
    useProjectStoreRera();
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
          className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(255,113,133,0.6)]'
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
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Project Phase:</span>
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
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Rera ID:</span>
            <input
              className={inputBoxClass}
              name='reraId'
              defaultValue={tower.reraId}
              onChange={(e) =>
                updateTowerFormDataRera(tower.id, 'reraId', e.target.value)
              }
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Tower Type:</span>
            <div className='flex flex-[5] '>
              <Select
                className='w-full flex-1'
                name='projectSubType1'
                options={projectFormDataRera.towerTypeOptions}
                defaultValue={tower.towerType}
                onChange={(e: SingleValue<{ label: string; value: string }>) =>
                  updateTowerFormDataRera(tower.id, 'towerType', e)
                }
              />
              <span className='ml-[6px] min-h-11 w-full flex-1 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
                <span>{tower.towerTypeSuggestion}</span>
              </span>
            </div>
          </label>
          {projectFormDataRera.isRERAProject && (
            <label className='flex flex-wrap items-center justify-between gap-5 '>
              <span className='flex flex-[2] items-center  '>
                <span>RERA Tower ID:</span>
              </span>
              <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
                <span>{tower.reraTowerId}</span>
              </span>
            </label>
          )}
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex flex-[2] items-center  '>
              <span>Tower Name:</span>
              <span
                className='tooltip'
                data-tip='All alternate tower names separated by &#39;-&#39;, eg., A-ALPHA'
              >
                <BiInfoCircle size={20} />
              </span>
            </span>
            <input
              className={inputBoxClass}
              name='towerName'
              defaultValue={tower.towerName}
              onChange={(e) =>
                updateTowerFormDataRera(tower.id, 'towerName', e.target.value)
              }
            />
          </label>
          <ETLTagConfiguration
            addEtlUnitConfig={addEtlUnitConfigRera}
            deleteEtlUnitConfig={deleteEtlUnitConfigRera}
            towerData={tower}
            updateETLUnitConfig={updateEtlUnitConfigRera}
          />
          <TowerUnitDetails
            towerData={tower}
            towersFormData={towerFormDataRera}
            updateTowerForm={updateTowerFormDataRera}
          />
          {!isApartmentSingle && (
            <div className='absolute -bottom-6 -left-5 z-10 w-full '>
              <button
                type='button'
                className='btn btn-md mx-auto flex items-center border-none bg-rose-300 hover:bg-rose-400 '
                onClick={() => {
                  const newData = {
                    ...tower,
                    id:
                      Math.max(...towerFormDataRera.map((data) => data.id)) + 1,
                    towerName: '',
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
