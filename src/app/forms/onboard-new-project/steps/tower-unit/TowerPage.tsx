'use client';

import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { nanoid } from 'nanoid';
import { BiCopy } from 'react-icons/bi';
// import UnitSection from './UnitSection';
import {
  TowerUnitDetailType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { ColumnDef } from '@tanstack/react-table';
import axiosClient from '@/utils/AxiosClient';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import toast from 'react-hot-toast';

const hmRefTableColumns: ColumnDef<object, any>[] = [
  {
    accessorKey: 'tower_name',
    header: 'Tower Name',
    cell: ({ row }) => (
      <p className='w-[100px]'>{row.getValue('tower_name')}</p>
    ),
  },
  {
    header: 'Freq',
    accessorKey: 'freq',
  },
  {
    header: 'Unit Numbers',
    cell: ({ row }) => (
      <p className='whitespace-break-spaces text-pretty text-justify text-xs'>
        {row.getValue('unit_numbers')}
      </p>
    ),
    accessorKey: 'unit_numbers',
  },
];
const tmRefTableColumns: ColumnDef<object, any>[] = [
  {
    accessorKey: 'apt_name',
    header: 'Apt name',
    cell: ({ row }) => <p className='w-[150px]'>{row.getValue('apt_name')}</p>,
  },
  {
    header: 'Freq',
    accessorKey: 'freq',
    cell: ({ row }) => <p className='w-[50px]'>{row.getValue('freq')}</p>,
  },
];

export default function TowerPage() {
  const {
    // copyUnitCard,
    // addNewUnitCard,
    // updateUnitCard,
    updateTowerFormData,
    towerFormData,
    addNewTowerCard,
    deleteTowerCard,
    setTowerFormData,
    // deleteUnitCard,
    setExistingUnitTypeOption,
    hmRefTable,
    duplicateTowerCard,
    tmRefTable,
    updateTMRefTable,
    updateHMRefTable,
  } = useTowerUnitStore();
  const [towerCardCount, setTowerCardCount] = useState<number>(0);
  const { onboardingData } = useOnboardingDataStore();
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

  async function fetchRefTables() {
    const selectedProjectIds = onboardingData.selectedReraProjects.map(
      (item) => +item.value
    );

    const res = axiosClient.get<{
      data: {
        apt_name: string;
        unit_type: string;
        count: string;
        floors: number[];
        unit_numbers: number[];
      }[];
    }>('/forms/tmReferenceTable', {
      params: { temp_id: onboardingData.selectedTempProject?.value },
    });
    toast.promise(
      res,
      {
        loading: 'Fetching TM Ref Table...',
        success: (data) => {
          const tableData = data.data.data.map((item) => ({
            apt_name: item.apt_name,
            unit_type: item.unit_type,
            freq: item.count,
            floors: item.floors ? item.floors?.join(', ') : 'N/A',
            unit_numbers: item.unit_numbers
              ? item.unit_numbers?.join(', ')
              : 'N/A',
          }));
          tableData.sort((a, b) => {
            if (+a.freq > +b.freq) {
              return -1;
            }
            if (+a.freq < +b.freq) {
              return 1;
            }
            return 0;
          });
          updateTMRefTable(tableData);
          return 'TM Ref Table fetched';
        },
        error: 'Error',
      },
      { duration: 8000 }
    );

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
          JSON.stringify(
            onboardingData.coreDoorNumberStrings.map((item) => item + '%')
          )
        ),
      },
    });

    toast.promise(
      hmProjectTypeRes,
      {
        loading: 'Fetching HM Ref Table...',
        success: ({ data }) => {
          const towerCardData: TowerUnitDetailType[] = [];
          updateHMRefTable(
            data.data.map((item, idx) => {
              const unit_numbers: string[] = [];
              item.house_nos.map((house_no) => {
                unit_numbers.push(house_no.split('/').pop() || '');
              });
              towerCardData.push({
                id: idx + 1,
                projectPhase: 1,
                reraId: '',
                towerType: null,
                singleUnit: false,
                displayTowerType: null,
                reraTowerId: '',
                towerNameETL: item.tower_name,
                towerNameDisplay: item.tower_name,
                towerDoorNoString:
                  item.pattern.replace('%', '') + item.tower_name + '/{UUU}',
                unitCards: [],
              });
              return {
                tower_name: item.tower_name,
                freq: +item.freq,
                unit_numbers: unit_numbers.join(', '),
              };
            })
          );
          if (selectedProjectIds.length === 0) {
            setTowerFormData(towerCardData);
          }
          return 'HM Ref Table fetched';
        },
        error: 'Error',
      },
      { duration: 5000 }
    );
  }

  return (
    <div className='flex flex-col text-sm'>
      <label className='mx-auto mb-5 flex max-w-[600px] flex-wrap items-center justify-between gap-5'>
        <input
          placeholder='Enter Tower Card Count'
          className={cn(inputBoxClass, 'max-w-[180px]')}
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

      <button
        className='btn-rezy my-4 self-center'
        onClick={() => fetchRefTables()}
      >
        {onboardingData.selectedReraProjects.length
          ? 'Fetch Only TM & HM Ref Tables'
          : 'Fetch TM & HM Ref and Tower Cards'}
      </button>

      <div className='flex gap-2'>
        {tmRefTable && tmRefTable.length > 0 && (
          <div className='flex- sticky top-1 max-h-[99dvh] overflow-x-auto overflow-y-auto rounded-lg border-2'>
            <p className='mt-2 text-center text-2xl font-semibold'>
              TM Ref Table
            </p>
            <TanstackReactTable
              data={tmRefTable}
              columns={tmRefTableColumns}
              showPagination={false}
              enableSearch={false}
              showAllRows={true}
            />
          </div>
        )}

        <div className='flex-[2]'>
          {towerFormData.map((tower) => (
            <div
              className='tower-card-container relative z-0 flex flex-col transition-all duration-1000'
              key={tower.id}
            >
              <div className='moveTransition tower-card relative mb-14 flex flex-col gap-2 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'>
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
                      updateTowerFormData(tower.id, {
                        reraTowerId: e.target.value,
                      })
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
                {/* <UnitSection
                  unitCards={tower.unitCards}
                  updateUnitCard={updateUnitCard}
                  towerId={tower.id}
                  copyUnitCard={copyUnitCard}
                  addNewUnitCard={addNewUnitCard}
                  deleteUnitCard={deleteUnitCard}
                /> */}
              </div>
            </div>
          ))}
        </div>
        {hmRefTable && hmRefTable.length > 0 && (
          <div className='sticky top-0 max-h-screen flex-[2] overflow-x-auto overflow-y-auto rounded-lg border-2'>
            <p className='mt-2 text-center text-2xl font-semibold'>
              HM Ref Table
            </p>
            <TanstackReactTable
              data={hmRefTable}
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
