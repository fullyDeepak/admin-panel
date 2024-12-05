'use client';

import { useEffect, useState } from 'react';

import { useTowerUnitStore } from '../../useTowerUnitStore';
import UnitSection from './UnitSection';
import RefTable from './RefTable';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  LockKeyholeOpen,
} from 'lucide-react';
import TowerDetails from './TowerDetails';
import { cn } from '@/lib/utils';
import { PiMicrosoftExcelLogoDuotone } from 'react-icons/pi';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { hmRefTableColumns } from '@/app/forms/onboard-new-project/steps/tower-unit/TowerPage';
import axiosClient from '@/utils/AxiosClient';
import toast from 'react-hot-toast';
import { inputBoxClass } from '@/app/constants/tw-class';

export default function TowerSection() {
  const {
    copyUnitCard,
    addNewUnitCard,
    updateUnitCard,
    updateTowerFormData,
    towerFormData,
    showTMRefTable,
    deleteUnitCard,
    setExistingUnitTypeOption,
    setTowerFloorPlanFile,
    removeTowerFloorPlanFile,
    lockUnitType,
    setLockUnitType,
    coreDoorNumberString,
    setCoreDoorNumberString,
  } = useTowerUnitStore((state) => ({
    copyUnitCard: state.copyUnitCard,
    addNewUnitCard: state.addNewUnitCard,
    updateUnitCard: state.updateUnitCard,
    updateTowerFormData: state.updateTowerFormData,
    towerFormData: state.towerFormData,
    showTMRefTable: state.showTMRefTable,
    deleteUnitCard: state.deleteUnitCard,
    setExistingUnitTypeOption: state.setExistingUnitTypeOption,
    setTowerFloorPlanFile: state.setTowerFloorPlanFile,
    removeTowerFloorPlanFile: state.removeTowerFloorPlanFile,
    lockUnitType: state.lockUnitType,
    setLockUnitType: state.setLockUnitType,
    coreDoorNumberString: state.coreDoorNumberString,
    setCoreDoorNumberString: state.setCoreDoorNumberString,
  }));

  useEffect(() => {
    const options: {
      label: string;
      value: string;
    }[] = [];
    towerFormData.map((tower) => {
      tower.unitCards.map((unitCard) => {
        options.push({
          label: `T${tower.tower_id}:U${unitCard.id}:${unitCard.configName}:${unitCard.salableArea}`,
          value: `${tower.tower_id}:${unitCard.id}`,
        });
      });
    });
    setExistingUnitTypeOption(options);
  }, [towerFormData]);

  const [showRefTable, setShowRefTable] = useState<boolean>(false);
  const [hmRefTableData, setHmRefTableData] = useState<
    {
      tower_name: string;
      freq: number;
      unit_numbers: string;
    }[]
  >([]);

  async function fetchRefTables() {
    if (coreDoorNumberString.length === 0) {
      toast.error("HM data won't be fetched without Core Door Numbers.");
      return null;
    }

    const hmProjectTypeRes = axiosClient.get<{
      data: {
        tower_name: string;
        freq: string;
        house_nos: string[];
        pattern: string;
      }[];
    }>('/forms/hmReferenceTable', {
      params: {
        strings: encodeURIComponent(
          JSON.stringify([coreDoorNumberString + '%'])
        ),
      },
    });

    toast.promise(
      hmProjectTypeRes,
      {
        loading: 'Fetching HM Ref Table...',
        success: ({ data }) => {
          setHmRefTableData(
            data.data.map((item) => {
              const unit_numbers: string[] = [];
              item.house_nos.map((house_no) => {
                unit_numbers.push(house_no.split('/').pop() || '');
              });
              return {
                tower_name: item.tower_name,
                freq: +item.freq,
                unit_numbers: unit_numbers.join(', '),
              };
            })
          );
          setShowRefTable(true);
          return 'HM Ref Table fetched with ' + data.data.length + ' entries';
        },
        error: 'Error',
      },
      { duration: 5000 }
    );
  }

  return (
    <div className='flex flex-col text-sm'>
      <div className='flex items-center justify-evenly gap-5'>
        <label
          className={cn(
            'btn swap swap-rotate my-5 self-center',
            lockUnitType ? 'btn-error' : 'btn-success'
          )}
        >
          <input
            type='checkbox'
            onChange={(e) => setLockUnitType(e.target.checked)}
            checked={lockUnitType}
          />
          <div className='swap-on flex items-center gap-2 text-white'>
            <LockKeyhole size={20} />{' '}
            <span className='mt-1'>Unit Type Locked</span>
          </div>
          <div className='swap-off flex items-center gap-2 text-white'>
            <LockKeyholeOpen size={20} />{' '}
            <span className='mt-1'>Unit Type Open</span>
          </div>
        </label>
        <input
          type='text'
          className={cn(inputBoxClass, 'max-w-40')}
          placeholder='Door no string'
          value={coreDoorNumberString}
          onChange={(e) => setCoreDoorNumberString(e.target.value)}
        />
        <button
          className='btn my-4 border border-gray-300 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          onClick={fetchRefTables}
        >
          <PiMicrosoftExcelLogoDuotone className='text-green-600' size={25} />
          Fetch Ref Tables
        </button>
        <button
          className='btn btn-accent'
          onClick={() => setShowRefTable((prev) => !prev)}
        >
          Toggle HM Table View
        </button>
      </div>
      <div
        className={cn('flex gap-3', !showRefTable && 'max-w-[80%] self-center')}
      >
        <div className={cn('flex-[4]')}>
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
                <TowerDetails
                  tower={tower}
                  updateTowerFormData={updateTowerFormData}
                  removeTowerFloorPlanFile={removeTowerFloorPlanFile}
                  setTowerFloorPlanFile={setTowerFloorPlanFile}
                />
                <RefTable
                  reraRefTable={tower.reraRefTable}
                  tmRefTable={tower.tmRefTable}
                  showTMRefTable={showTMRefTable}
                />
                <UnitSection
                  towerData={tower}
                  updateUnitCard={updateUnitCard}
                  copyUnitCard={copyUnitCard}
                  addNewUnitCard={addNewUnitCard}
                  deleteUnitCard={deleteUnitCard}
                />
              </div>
            </div>
          ))}
        </div>
        {showRefTable && hmRefTableData && hmRefTableData.length > 0 && (
          <div className='sticky top-0 max-h-screen flex-[2] overflow-x-auto overflow-y-auto rounded-lg border-2'>
            <p className='mt-2 text-center text-2xl font-semibold'>
              HM Ref Table
            </p>
            <TanstackReactTable
              data={hmRefTableData}
              columns={hmRefTableColumns}
              showPagination={false}
              enableSearch={false}
              showAllRows={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
