import { inputBoxClass } from '@/app/constants/tw-class';
import { useProjectStore } from '@/store/useProjectStore';
import { useTowerStore } from '@/store/useTowerStore';
import { useEffect, useState } from 'react';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import Select, { SingleValue } from 'react-select';

export default function TowerForm() {
  const {
    towerFormData,
    updateTowerFormData,
    deleteTowerFormData,
    addNewTowerData,
    addEtlUnitConfig,
    deleteEtlUnitConfig,
  } = useTowerStore();
  const { projectFormData } = useProjectStore();
  const [configName, setConfigName] = useState('');
  const [configMin, setConfigMin] = useState(0);
  const [configMax, setConfigMax] = useState(0);
  const [isApartmentSingle, setIsApartmentSingle] = useState<boolean>(false);

  useEffect(() => {
    if (towerFormData[0].towerType?.value === 'apartmentSingle') {
      setIsApartmentSingle(true);
      const cardCount = towerFormData.map((item) => item.id);
      while (cardCount.length !== 1) {
        const pop = cardCount.pop();
        if (pop) {
          deleteTowerFormData(pop);
        }
      }
    } else {
      setIsApartmentSingle(false);
    }
  }, [towerFormData[0].towerType?.value]);

  return (
    <div className='tower-card-container relative flex flex-col transition-all duration-1000'>
      {towerFormData.map((tower) => (
        <div
          className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(255,113,133,0.6)]'
          key={tower.id}
        >
          <span className='text-center font-semibold'>Card id: {tower.id}</span>
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
            type='button'
            onClick={() => {
              if (towerFormData.length > 1) {
                deleteTowerFormData(tower.id);
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
                updateTowerFormData(tower.id, 'projectPhase', +e.target.value)
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
                updateTowerFormData(tower.id, 'reraId', e.target.value)
              }
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex-[2] '>Tower Type:</span>
            <Select
              className='w-full flex-[5]'
              name='projectSubType1'
              options={projectFormData.towerTypeOptions}
              defaultValue={tower.towerType}
              onChange={(e: SingleValue<{ label: string; value: string }>) =>
                updateTowerFormData(tower.id, 'towerType', e)
              }
            />
          </label>
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
                updateTowerFormData(tower.id, 'towerName', e.target.value)
              }
            />
          </label>
          <div>
            ETL Unit tag configurations:
            <div className='my-5 flex w-[80%] flex-col gap-2'>
              <div className='flex justify-between '>
                <span>Config. Name</span>
                <span>Min</span>
                <span>Max</span>
                <span>Remove</span>
              </div>
              {tower.etlUnitConfigs.map(
                (item, i) =>
                  item.configName && (
                    <div key={i} className='flex justify-between '>
                      <span>{item.configName}</span>
                      <span>{item.minArea}</span>
                      <span>{item.maxArea}</span>
                      <button
                        className='cursor-pointer'
                        type='button'
                        onClick={() =>
                          deleteEtlUnitConfig(tower.id, item.configName)
                        }
                      >
                        &times;
                      </button>
                    </div>
                  )
              )}
            </div>
          </div>
          <button
            className='btn btn-outline btn-sm border-none  bg-rose-500 text-white hover:border-none hover:bg-rose-600'
            onClick={() =>
              (
                document.getElementById(
                  `config-dialog-${tower.id}`
                ) as HTMLDialogElement
              ).showModal()
            }
            type='button'
          >
            Add ETL Unit tag configurations
          </button>
          <dialog id={`config-dialog-${tower.id}`} className='modal'>
            <div className='modal-box max-w-[60%]'>
              <button
                className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
                type='button'
                onClick={() =>
                  (
                    document.getElementById(
                      `config-dialog-${tower.id}`
                    ) as HTMLDialogElement
                  ).close()
                }
              >
                ✕
              </button>
              <h3 className='text-lg font-bold'>Add configuration for each</h3>
              <div className='flex items-center justify-between py-10'>
                <label className='flex flex-col flex-wrap items-center justify-between gap-5 '>
                  <span className='flex-[2] '>Configuration Name:</span>
                  <input
                    type='text'
                    className={inputBoxClass}
                    name='configName'
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                  />
                </label>
                <label className='flex flex-col flex-wrap items-center justify-between gap-5 '>
                  <span className='flex-[2] '>Min Area:</span>
                  <input
                    min={0}
                    type='number'
                    className={inputBoxClass}
                    name='configMin'
                    value={configMin ? configMin : ''}
                    onChange={(e) => setConfigMin(+e.target.value)}
                  />
                </label>
                <label className='flex flex-col flex-wrap items-center justify-between gap-5 '>
                  <span className='flex-[2] '>Max Area:</span>
                  <input
                    min={0}
                    type='number'
                    className={inputBoxClass}
                    value={configMax ? configMax : ''}
                    name='configMax'
                    onChange={(e) => setConfigMax(+e.target.value)}
                  />
                </label>
              </div>
              <button
                className='btn btn-sm mx-auto flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700'
                type='button'
                onClick={() => {
                  console.log(tower.id);

                  if (configName && configMin && configMax) {
                    const configNames = tower.etlUnitConfigs.map(
                      (item) => item.configName
                    );
                    if (configNames.includes(configName.trim())) {
                      alert('Duplicate configuration.');
                      return;
                    }
                    addEtlUnitConfig(
                      tower.id,
                      configName.toUpperCase(),
                      configMin,
                      configMax
                    );
                    (
                      document.getElementById(
                        `config-dialog-${tower.id}`
                      ) as HTMLDialogElement
                    ).close();
                    setConfigName('');
                    setConfigMin(0);
                    setConfigMax(0);
                  } else {
                    alert('Please enter all details.');
                  }
                }}
              >
                Add
              </button>
            </div>
          </dialog>
          {!isApartmentSingle && (
            <div className='absolute -bottom-6 -left-5 z-10 w-full '>
              <button
                type='button'
                className='btn btn-md mx-auto flex items-center border-none bg-rose-300 hover:bg-rose-400 '
                onClick={() => {
                  const newData = {
                    ...tower,
                    id: Math.max(...towerFormData.map((data) => data.id)) + 1,
                    towerName: '',
                  };
                  addNewTowerData(newData);
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
