import { inputBoxClass } from '@/app/constants/tw-class';
import { useEditProjectStore } from './useEditProjectStore';
import { editTowerDetail, useEditTowerStore } from './useEditTowerStore';
import { useEffect, useState } from 'react';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import TowerUnitDetails from '@/components/forms/TowerUnitDetails';
import ETLTagConfiguration from '@/components/forms/ETLTagConfiguration';
import TowerMatcherSection from '@/components/forms/TowerMatcherSection';

export default function TowerForm() {
  const {
    editTowerFormData,
    updateEditTowerFormData,
    deleteEditTowerFormData,
    addNewEditTowerData,
    addEtlUnitConfig,
    deleteEtlUnitConfig,
    updateEtlUnitConfig,
  } = useEditTowerStore();
  const { editProjectFormData } = useEditProjectStore();
  const [isApartmentSingle, setIsApartmentSingle] = useState<boolean>(false);

  useEffect(() => {
    if (editTowerFormData[0].towerType === 'apartmentSingle') {
      setIsApartmentSingle(true);
      const cardCount = editTowerFormData.map((item) => item.id);
      while (cardCount.length !== 1) {
        const pop = cardCount.pop();
        if (pop) {
          deleteEditTowerFormData(pop);
        }
      }
    } else {
      setIsApartmentSingle(false);
    }
  }, [editTowerFormData[0].towerType]);

  return (
    <div className='tower-card-container relative flex flex-col transition-all duration-1000'>
      {editTowerFormData.map((tower) => (
        <div
          className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'
          key={tower.id}
        >
          <span className='text-center font-semibold'>Card id: {tower.id}</span>
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
            type='button'
            onClick={() => {
              if (editTowerFormData.length > 1) {
                deleteEditTowerFormData(tower.id);
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
                updateEditTowerFormData(
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
                updateEditTowerFormData(tower.id, 'reraId', e.target.value)
              }
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Tower Type:</span>
            <span className='w-full flex-[5] pl-2'>
              <Select
                onChange={(e) =>
                  updateEditTowerFormData(tower.id, 'towerType', e)
                }
                value={tower.towerType}
              >
                {editProjectFormData.towerTypeOptions?.map((option, index) => (
                  <Option
                    key={index}
                    value={option.value}
                    className='cursor-pointer'
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
            </span>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Display Tower Type:</span>
            <span className='w-full flex-[5] pl-2'>
              <Select
                onChange={(e) =>
                  updateEditTowerFormData(tower.id, 'displayTowerType', e)
                }
                value={tower.displayTowerType}
              >
                <Option key={1} value={'APARTMENT'} className='cursor-pointer'>
                  APARTMENT
                </Option>
                <Option key={2} value={'VILLA'} className='cursor-pointer'>
                  VILLA
                </Option>
              </Select>
            </span>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Tower ID:</span>
            </span>
            <span className='ml-[6px] w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'>
              <span>{tower.towerId}</span>
            </span>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Tower Name Alias:</span>
              <span
                className='tooltip'
                data-tip='All alternate tower names separated by &#39;-&#39;, eg., A-ALPHA'
              >
                <BiInfoCircle size={20} />
              </span>
            </span>
            <input
              className={inputBoxClass}
              name='towerNameAlias'
              defaultValue={tower.towerNameAlias}
              onChange={(e) =>
                updateEditTowerFormData(
                  tower.id,
                  'towerNameAlias',
                  e.target.value
                )
              }
            />
          </label>
          <ETLTagConfiguration
            addEtlUnitConfig={addEtlUnitConfig}
            deleteEtlUnitConfig={deleteEtlUnitConfig}
            towerData={tower}
            updateETLUnitConfig={updateEtlUnitConfig}
            updateTowerData={updateEditTowerFormData}
          />
          <TowerUnitDetails
            towerData={tower}
            towersFormData={editTowerFormData}
            updateTowerForm={updateEditTowerFormData}
          />
          <TowerMatcherSection
            towerFormData={tower}
            updateTowerFormData={updateEditTowerFormData}
          />
          {!isApartmentSingle && (
            <div className='absolute -bottom-6 -left-5 z-10 w-full'>
              <button
                type='button'
                className='btn btn-md mx-auto flex items-center border-none bg-violet-300 hover:bg-violet-400'
                onClick={() => {
                  const newData: editTowerDetail = {
                    ...tower,
                    id:
                      Math.max(...editTowerFormData.map((data) => data.id)) + 1,
                    etlTowerName: '',
                    towerNameAlias: '',
                    towerId: '__new',
                    maxFloor: 0,
                    groundFloorName: '',
                    deleteFullUnitNos: '',
                    exceptionUnitNos: '',
                    groundFloorUnitNoMax: 0,
                    groundFloorUnitNoMin: 0,
                    typicalFloorUnitNoMax: 0,
                    typicalFloorUnitNoMin: 0,
                    towerDoorNo: '',
                    validTowerUnits: null,
                  };
                  addNewEditTowerData(newData);
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
