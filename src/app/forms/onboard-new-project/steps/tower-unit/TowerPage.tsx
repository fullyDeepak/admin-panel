'use client';

import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { nanoid } from 'nanoid';
import { BiCopy } from 'react-icons/bi';
import {
  TowerUnitDetailType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CirclePlus, Minus, Plus, Trash2 } from 'lucide-react';
import TanstackReactTable from '@/components/tables/TanstackReactTable';
import { ColumnDef } from '@tanstack/react-table';
import axiosClient from '@/utils/AxiosClient';
import { useOnboardingDataStore } from '../../useOnboardingDataStore';
import toast from 'react-hot-toast';
import {
  PiCardsThreeDuotone,
  PiMicrosoftExcelLogoDuotone,
} from 'react-icons/pi';
import ETLTagConfiguration from './ETLTagConfiguration';

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

const saRefTableColumns: ColumnDef<object, any>[] = [
  {
    accessorKey: 'salable_area',
    header: 'Salable Area',
    cell: ({ row }) => (
      <p className='w-[150px]'>{row.getValue('salable_area')}</p>
    ),
  },
  {
    header: 'Freq',
    accessorKey: 'count',
    cell: ({ row }) => <p className='w-[50px]'>{row.getValue('count')}</p>,
  },
];

export default function TowerPage() {
  const {
    updateTowerFormData,
    towerFormData,
    addNewTowerCard,
    deleteTowerCard,
    setTowerFormData,
    hmRefTable,
    duplicateTowerCard,
    tmRefTable,
    updateTMRefTable,
    updateHMRefTable,
    toggleRefTable,
    showHMRefTable,
    showTMRefTable,
    addEtlUnitConfig,
    deleteEtlUnitConfig,
    saRefTable,
    updateSARefTable,
    updateEtlUnitConfig,
  } = useTowerUnitStore();
  const [towerCardCount, setTowerCardCount] = useState<number>(0);
  const { onboardingData } = useOnboardingDataStore();

  async function fetchRefTables() {
    const selectedReraProjectIds = onboardingData.selectedReraProjects.map(
      (item) => +item.value
    );

    if (
      !onboardingData.selectedTempProject?.value &&
      selectedReraProjectIds.length === 0
    ) {
      toast.error('Select a Temp Project or at least one RERA to fetch.');
      return;
    }
    const res = axiosClient.get<{
      data: {
        name_freq: {
          apt_name: string;
          unit_type: string;
          count: string;
          floors: number[];
          unit_numbers: number[];
        }[];
        salable_area_freq: {
          salable_area: number;
          count: string;
        }[];
      };
    }>('/forms/tmReferenceTable', {
      params: { temp_id: onboardingData.selectedTempProject?.value },
    });
    toast.promise(
      res,
      {
        loading: 'Fetching TM Ref Table...',
        success: ({ data }) => {
          const tableData = data.data.name_freq.map((item) => ({
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
          updateSARefTable(data.data.salable_area_freq);
          updateTMRefTable(tableData);
          return 'TM Ref Table fetched with ' + tableData.length + ' entries';
        },
        error: 'Error',
      },
      { duration: 8000 }
    );

    if (onboardingData.coreDoorNumberStrings.length === 0) {
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
          updateHMRefTable(
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
          return 'HM Ref Table fetched with ' + data.data.length + ' entries';
        },
        error: 'Error',
      },
      { duration: 5000 }
    );
  }

  async function fetchHMCards() {
    if (onboardingData.coreDoorNumberStrings.length === 0) {
      toast.error("Can't be fetch HM data without Core Door Numbers.");
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
          JSON.stringify(
            onboardingData.coreDoorNumberStrings.map((item) => item + '%')
          )
        ),
      },
    });

    toast.promise(
      hmProjectTypeRes,
      {
        loading: 'Fetching HM Tower Cards...',
        success: ({ data }) => {
          const towerCardData: TowerUnitDetailType[] = [];
          const towerType = towerFormData[0].towerType;
          const displayTowerType = towerFormData[0].displayTowerType;
          let nextId = Math.max(...towerFormData.map((item) => item.id));
          data.data.forEach((item) => {
            nextId++;
            towerCardData.push({
              id: nextId,
              projectPhase: 1,
              reraId: '',
              towerType: towerType,
              singleUnit: false,
              displayTowerType: displayTowerType,
              reraTowerId: '',
              towerNameETL: item.tower_name,
              towerNameDisplay: item.tower_name,
              towerDoorNoString:
                item.pattern.replace('%', '') + item.tower_name + '/{F}{UU}',
              etlUnitConfigs: [],
              gfName: '',
            });
          });

          if (towerCardData?.length > 0) {
            setTowerFormData(towerFormData.concat(towerCardData));
          }
          return towerCardData.length
            ? towerCardData.length + ' HM Cards found and added.'
            : 'No card found 😢';
        },
        error: 'Error',
      },
      { duration: 5000 }
    );
  }

  return (
    <div className='flex flex-col text-sm'>
      <label className='mx-auto mb-5 flex max-w-[800px] flex-wrap items-center justify-between gap-5'>
        <input
          placeholder='Enter Tower Card Count'
          className={cn(inputBoxClass, 'w-[180px]')}
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
            if (towerCardCount > 0) {
              Array.from({ length: towerCardCount }).forEach(() =>
                addNewTowerCard()
              );
            }
          }}
          className='btn btn-success items-center text-white'
          disabled={towerCardCount === 0}
        >
          <CirclePlus />
          <span>Add Tower Card</span>
        </button>
        <button
          onClick={() => {
            setTowerFormData([]);
          }}
          className='btn btn-error items-center text-white'
        >
          <Trash2 />
          Delete All Tower Cards
        </button>
      </label>

      <div className='flex items-center justify-around'>
        <button className='btn btn-accent' onClick={() => toggleRefTable('tm')}>
          Toggle TM Table View
        </button>
        <button
          className='btn my-4 border border-gray-300 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          onClick={fetchRefTables}
        >
          <PiMicrosoftExcelLogoDuotone className='text-green-600' size={25} />
          Fetch Ref Tables
        </button>
        <button
          className='btn my-4 border border-gray-300 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          onClick={fetchHMCards}
        >
          <PiCardsThreeDuotone className='text-green-600' size={25} />
          Add HM Cards
        </button>
        <button className='btn btn-accent' onClick={() => toggleRefTable('hm')}>
          Toggle HM Table View
        </button>
      </div>

      <div className='flex gap-2'>
        {showTMRefTable && tmRefTable && tmRefTable.length > 0 && (
          <div className='sticky top-1 max-h-[99dvh] rounded-lg border-2'>
            <p className='mt-2 text-center text-2xl font-semibold'>
              TM Ref Tables
            </p>
            <div className='flex max-h-[98dvh] flex-col'>
              <div className='max-h-[40dvh] overflow-y-auto'>
                <TanstackReactTable
                  data={saRefTable}
                  columns={saRefTableColumns}
                  showPagination={false}
                  enableSearch={false}
                  showAllRows={true}
                />
              </div>
              <hr />
              <div className='max-h-[50dvh] overflow-y-auto'>
                <TanstackReactTable
                  data={tmRefTable}
                  columns={tmRefTableColumns}
                  showPagination={false}
                  enableSearch={false}
                  showAllRows={true}
                />
              </div>
            </div>
          </div>
        )}

        <div className='flex-[2]'>
          {towerFormData.map((tower, idx) => (
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
                    if (confirm('Are you sure?')) {
                      deleteTowerCard(tower.id);
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
                    checked={tower.singleUnit}
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
                <label className='flex flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[2]'>GF Name:</span>
                  <input
                    className={inputBoxClass}
                    defaultValue={tower.gfName}
                    onChange={(e) =>
                      updateTowerFormData(tower.id, {
                        gfName: e.target.value,
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
                <ETLTagConfiguration
                  towerData={tower}
                  addEtlUnitConfig={addEtlUnitConfig}
                  deleteEtlUnitConfig={deleteEtlUnitConfig}
                  updateETLUnitConfig={updateEtlUnitConfig}
                  towerFormData={towerFormData}
                  updateTowerFormData={updateTowerFormData}
                  showCopyButton={idx === 0}
                />
              </div>
            </div>
          ))}
        </div>
        {showHMRefTable && hmRefTable && hmRefTable.length > 0 && (
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
