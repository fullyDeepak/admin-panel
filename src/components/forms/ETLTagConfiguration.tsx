import { inputBoxClass } from '@/app/constants/tw-class';
import { FormEtlUnitConfigType, FormTowerDetailType } from '@/types/types';
import { useState } from 'react';
import { FiCheckCircle, FiEdit } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';

interface ETLTagConfigurationProps {
  towerData: FormTowerDetailType;
  updateETLUnitConfig: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
  deleteEtlUnitConfig: (towerId: number, configName: string) => void;
  addEtlUnitConfig: (
    towerId: number,
    configName: string,
    minArea: number,
    maxArea: number
  ) => void;
}

export default function ETLTagConfiguration({
  updateETLUnitConfig,
  towerData,
  deleteEtlUnitConfig,
  addEtlUnitConfig,
}: ETLTagConfigurationProps) {
  const [configName, setConfigName] = useState('');
  const [configMin, setConfigMin] = useState(0);
  const [configMax, setConfigMax] = useState(0);
  const [showInput, setShowInput] = useState<{
    configName: string;
    status: boolean;
  }>({ configName: '', status: false });
  const [isApartmentSingle, setIsApartmentSingle] = useState<boolean>(false);
  return (
    <>
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
          {towerData.etlUnitConfigs.map(
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
                          updateETLUnitConfig(
                            towerData.id,
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
                          updateETLUnitConfig(
                            towerData.id,
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
                      deleteEtlUnitConfig(towerData.id, unit.configName)
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
              `config-dialog-${towerData.id}`
            ) as HTMLDialogElement
          ).showModal()
        }
        type='button'
      >
        Add ETL Unit tag configurations
      </button>{' '}
      <dialog id={`config-dialog-${towerData.id}`} className='modal'>
        <div className='modal-box max-w-[60%]'>
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
            type='button'
            onClick={() =>
              (
                document.getElementById(
                  `config-dialog-${towerData.id}`
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
              console.log(towerData.id);
              const configNames = towerData.etlUnitConfigs.map(
                (item) => item.configName
              );
              console.log(configNames);
              if (configName && configMin && configMax) {
                if (configNames.includes(configName.trim().toUpperCase())) {
                  alert('Duplicate configuration.');
                  return;
                }
                addEtlUnitConfig(
                  towerData.id,
                  configName.toUpperCase(),
                  configMin,
                  configMax
                );
                (
                  document.getElementById(
                    `config-dialog-${towerData.id}`
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
    </>
  );
}