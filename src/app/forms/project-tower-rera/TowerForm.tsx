import { inputBoxClass } from '@/app/constants/tw-class';
import { useProjectStore } from '@/store/useProjectStore';
import { useTowerStoreRera } from '@/store/useTowerStoreRera';
import { useEffect, useState } from 'react';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import Select, { SingleValue } from 'react-select';
import { FiCheckCircle, FiEdit } from 'react-icons/fi';
import { MdOutlinePlaylistRemove } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';

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
  const { projectFormData } = useProjectStore();
  const [configName, setConfigName] = useState('');
  const [configMin, setConfigMin] = useState(0);
  const [configMax, setConfigMax] = useState(0);
  const [showInput, setShowInput] = useState<{
    configName: string;
    status: boolean;
  }>({ configName: '', status: false });
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
                options={projectFormData.towerTypeOptions}
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
          <label className='flex flex-wrap items-center justify-between gap-5 '>
            <span className='flex flex-[2] items-center  '>
              <span>Tower ID:</span>
            </span>
            <span className='ml-[6px] min-h-11 w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 '>
              <span>{tower.towerId}</span>
            </span>
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
                updateTowerFormDataRera(tower.id, 'towerName', e.target.value)
              }
            />
          </label>
          <div>
            ETL Unit tag configurations:
            <div className='mx-auto my-5 flex w-[90%] flex-col gap-2'>
              <div className='flex w-full justify-between '>
                <span className='w-36 font-semibold'>Name</span>
                <span className='w-36 font-semibold'>Min</span>
                <span className='w-36 font-semibold'>Max</span>
                <span className='w-36 font-semibold'>Edit</span>
                <span className='w-36 font-semibold'>Remove</span>
              </div>
              {tower.etlUnitConfigs.map(
                (unit, i) =>
                  unit.configName && (
                    <div key={i} className='flex w-full justify-between '>
                      <span className='w-36 p-1'>{unit.configName}</span>
                      <span
                        className='w-36 p-1'
                        hidden={
                          showInput.configName === unit.configName
                            ? showInput.status
                            : undefined
                        }
                      >
                        {unit.minArea}
                      </span>
                      {showInput.configName === unit.configName &&
                        showInput.status === true && (
                          <input
                            type='text'
                            className={` ${inputBoxClass} flex-2 ml-0 !w-36 !flex-[0] !p-1`}
                            value={unit.minArea}
                            onChange={(e) =>
                              updateEtlUnitConfigRera(
                                tower.id,
                                unit.configName,
                                +e.target.value,
                                unit.maxArea
                              )
                            }
                          />
                        )}
                      <span
                        className='w-36 p-1'
                        hidden={
                          showInput.configName === unit.configName
                            ? showInput.status
                            : undefined
                        }
                      >
                        {unit.maxArea}
                      </span>
                      {showInput.configName === unit.configName &&
                        showInput.status === true && (
                          <input
                            type='text'
                            className={` ${inputBoxClass} flex-2 ml-0 !w-36 !flex-[0] !p-1`}
                            value={unit.maxArea}
                            onChange={(e) =>
                              updateEtlUnitConfigRera(
                                tower.id,
                                unit.configName,
                                unit.minArea,
                                +e.target.value
                              )
                            }
                          />
                        )}
                      <button
                        className='w-36 p-1'
                        type='button'
                        onClick={() => {
                          setShowInput({
                            configName: unit.configName,
                            status: !showInput.status,
                          });
                        }}
                      >
                        {showInput.configName === unit.configName &&
                        showInput.status === true ? (
                          <FiCheckCircle className='text-green-500' size={22} />
                        ) : (
                          <FiEdit className='text-indigo-500' size={22} />
                        )}
                      </button>
                      <button
                        className='w-36 cursor-pointer'
                        type='button'
                        onClick={() =>
                          deleteEtlUnitConfigRera(tower.id, unit.configName)
                        }
                      >
                        <TiDeleteOutline size={25} className='text-red-500' />
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
                  const configNames = tower.etlUnitConfigs.map(
                    (item) => item.configName
                  );
                  console.log(configNames);
                  if (configName && configMin && configMax) {
                    if (configNames.includes(configName.trim().toUpperCase())) {
                      alert('Duplicate configuration.');
                      return;
                    }
                    addEtlUnitConfigRera(
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