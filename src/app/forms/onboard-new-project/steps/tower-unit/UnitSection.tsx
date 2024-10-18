import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { BadgeCheckIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { TbMapEast, TbMapNorth, TbMapSouth, TbMapWest } from 'react-icons/tb';
import { BiCopy, BiPlus } from 'react-icons/bi';
import { UnitCardType, useTowerUnitStore } from '../../useTowerUnitStore';
import { CornerIcon } from './CornerIcon';

type Props = {
  unitCards: UnitCardType[];
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  towerId: number;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
};

export default function UnitSection({
  towerId,
  unitCards,
  updateUnitCard,
  copyUnitCard,
  addNewUnitCard,
  deleteUnitCard,
}: Props) {
  const { existingUnitTypeOption } = useTowerUnitStore();

  return (
    <div>
      {unitCards && unitCards.length > 0 ? (
        unitCards.map((unitData) => (
          <div
            className='relative my-10 space-y-1 rounded-lg bg-amber-50 p-5 pb-10 text-sm shadow-[0px_0px_3px_2px_#b7791f]'
            key={unitData.id}
          >
            <h2 className='text-xl font-semibold'>Section: Unit Card</h2>
            <p className='text-center font-semibold'>
              Tower Card id: {towerId} &nbsp; &nbsp; &nbsp; &nbsp; Unit Type
              Card id: {unitData.id}
            </p>
            <button
              className='absolute right-2 top-0 m-2 size-8 rounded-full text-sm font-semibold hover:bg-gray-300'
              type='button'
              onClick={() => {
                confirm('Are you sure?') &&
                  deleteUnitCard(towerId, unitData.id);
              }}
            >
              ✕
            </button>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Rera Unit Type:</span>
              <div className='flex flex-[5]'>
                <Select
                  className='w-full flex-1'
                  instanceId={nanoid()}
                  options={[]}
                  defaultValue={unitData.reraUnitType}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      reraUnitType: e,
                    })
                  }
                />
              </div>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Existing Unit Type:</span>
              <div className='flex flex-[5]'>
                <Select
                  className='w-full flex-1'
                  instanceId={nanoid()}
                  options={existingUnitTypeOption}
                  onChange={(e) => {
                    //  fill current unit card`
                  }}
                />
              </div>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Salable Area:</span>
              <div className='flex flex-[5] items-center gap-2'>
                <input
                  placeholder='Min'
                  type='number'
                  className={cn(inputBoxClass, 'ml-0')}
                  defaultValue={unitData.salableAreaMin || ''}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      salableAreaMin: +e.target.value,
                    })
                  }
                />
                <input
                  placeholder='Max'
                  type='number'
                  className={inputBoxClass}
                  defaultValue={unitData.salableAreaMax || ''}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      salableAreaMax: +e.target.value,
                    })
                  }
                />
              </div>
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Extent:</span>
              <div className='flex flex-[5] items-center gap-2'>
                <input
                  placeholder='Min'
                  type='number'
                  className={cn(inputBoxClass, 'ml-0')}
                  defaultValue={unitData.extentMin || ''}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      extentMin: +e.target.value,
                    })
                  }
                />
                <input
                  placeholder='Max'
                  type='number'
                  className={inputBoxClass}
                  defaultValue={unitData.extentMax || ''}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      extentMax: +e.target.value,
                    })
                  }
                />
              </div>
            </label>

            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Facing and Corner:</span>
              <div className='flex flex-[5]'>
                <div className='flex items-center gap-2'>
                  <label
                    className={cn(
                      'tooltip flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'N' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                    data-tip='North'
                  >
                    <input
                      type='checkbox'
                      name='facing'
                      className='hidden'
                      checked={unitData.facing === 'N'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateUnitCard(towerId, unitData.id, {
                            facing: 'N',
                          });
                        } else {
                          updateUnitCard(towerId, unitData.id, {
                            facing: null,
                          });
                        }
                      }}
                    />
                    <TbMapNorth size={30} strokeWidth={1.3} />
                  </label>
                  <label
                    className={cn(
                      'tooltip tooltip-bottom flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'S' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                    data-tip='South'
                  >
                    <input
                      type='checkbox'
                      name='facing'
                      className='hidden'
                      checked={unitData.facing === 'S'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateUnitCard(towerId, unitData.id, {
                            facing: 'S',
                          });
                        } else {
                          updateUnitCard(towerId, unitData.id, {
                            facing: null,
                          });
                        }
                      }}
                    />
                    <TbMapSouth size={30} strokeWidth={1.3} />
                  </label>
                  <label
                    className={cn(
                      'tooltip tooltip-right flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'E' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                    data-tip='East'
                  >
                    <input
                      type='checkbox'
                      name='facing'
                      className='hidden'
                      checked={unitData.facing === 'E'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateUnitCard(towerId, unitData.id, {
                            facing: 'E',
                          });
                        } else {
                          updateUnitCard(towerId, unitData.id, {
                            facing: null,
                          });
                        }
                      }}
                    />
                    <TbMapEast size={30} strokeWidth={1.3} />
                  </label>
                  <label
                    className={cn(
                      'tooltip tooltip-left flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'W' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                    data-tip='West'
                  >
                    <input
                      type='checkbox'
                      name='facing'
                      className='hidden'
                      checked={unitData.facing === 'W'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateUnitCard(towerId, unitData.id, {
                            facing: 'W',
                          });
                        } else {
                          updateUnitCard(towerId, unitData.id, {
                            facing: null,
                          });
                        }
                      }}
                    />
                    <TbMapWest size={30} strokeWidth={1.3} />
                  </label>
                </div>
                <div className='ml-60 flex items-center gap-2'>
                  <label
                    className={cn(
                      'tooltip flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.corner &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                    data-tip='Corner flag'
                  >
                    <input
                      type='checkbox'
                      name='corner'
                      className='hidden'
                      defaultChecked={unitData.corner}
                      onChange={(e) =>
                        updateUnitCard(towerId, unitData.id, {
                          corner: e.target.checked,
                        })
                      }
                    />
                    <CornerIcon className='size-6' />
                  </label>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <span className='flex-[2]'>Config and Unit Floor Count:</span>
              <div className='ml-3 flex w-full flex-[5] items-center gap-2'>
                <Select
                  className='flex-1'
                  instanceId={nanoid()}
                  defaultValue={unitData.configName}
                  onChange={(e) => {
                    updateUnitCard(towerId, unitData.id, { configName: e });
                  }}
                  options={[
                    {
                      value: 'Studio',
                      label: 'Studio',
                    },
                    {
                      value: '1BHK',
                      label: '1BHK',
                    },
                    {
                      value: '2BHK',
                      label: '2BHK',
                    },
                    {
                      value: '2.5BHK',
                      label: '2.5BHK',
                    },
                    {
                      value: '3BHK',
                      label: '3BHK',
                    },
                    {
                      value: '3.5BHK',
                      label: '3.5BHK',
                    },
                    {
                      value: '4BHK',
                      label: '4BHK',
                    },
                    {
                      value: '4BHK, Maid',
                      label: '4BHK, Maid',
                    },
                  ]}
                />
                <span
                  className='tooltip'
                  data-tip='Is this configuration verified?'
                >
                  <BadgeCheckIcon className='size-8' />
                </span>
                <input
                  type='checkbox'
                  defaultChecked={unitData.configVerified}
                  className='toggle toggle-success border-2'
                  title='Is this configuration verified?'
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      configVerified: e.target.checked,
                    })
                  }
                />
                <Select
                  className='flex-1'
                  instanceId={nanoid()}
                  defaultValue={
                    unitData.unitFloorCount || {
                      value: 'Simplex',
                      label: 'Simplex',
                    }
                  }
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      unitFloorCount: e,
                    })
                  }
                  options={[
                    {
                      value: 'Simplex',
                      label: 'Simplex',
                    },
                    {
                      value: 'Duplex',
                      label: 'Duplex',
                    },
                    {
                      value: 'Triplex',
                      label: 'Triplex',
                    },
                    {
                      value: 'G+1',
                      label: 'G+1',
                    },
                    {
                      value: 'G+2',
                      label: 'G+2',
                    },
                    {
                      value: 'G+3',
                      label: 'G+3',
                    },
                  ]}
                />
              </div>
            </div>
            <label className='flex flex-wrap items-center justify-between gap-5'></label>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Floor and Unit Nos:</span>
              <div className='flex flex-[5] items-center gap-2'>
                <input
                  className={`${inputBoxClass} !ml-0`}
                  defaultValue={unitData.floorNos}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      floorNos: e.target.value,
                    })
                  }
                  placeholder='Enter floor nos'
                />
                <input
                  className={inputBoxClass}
                  defaultValue={unitData.unitNos}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      unitNos: e.target.value,
                    })
                  }
                  placeholder='Enter unit nos'
                />
              </div>
            </div>
            <div className='absolute -bottom-4 -left-0 z-[0] flex w-full items-center'>
              <button
                type='button'
                className='btn btn-sm mx-auto flex items-center border-none bg-amber-400 hover:bg-amber-500'
                onClick={() =>
                  copyUnitCard(towerId, {
                    ...unitData,
                    id: unitData.id + 1,
                  })
                }
              >
                <BiCopy size={24} />
                <span>Copy</span>
              </button>
              <button
                type='button'
                className='btn btn-sm mx-auto flex items-center border-none bg-amber-400 hover:bg-amber-500'
                onClick={() => addNewUnitCard(towerId)}
              >
                <BiPlus size={30} />
                <span>New</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <button
            className={cn(
              'btn-rezy text-white',
              '!bg-amber-500 hover:!bg-amber-600'
            )}
            onClick={() => addNewUnitCard(towerId)}
          >
            Add Unit Card
          </button>
        </div>
      )}
    </div>
  );
}
