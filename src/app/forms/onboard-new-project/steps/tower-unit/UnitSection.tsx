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
};

export default function UnitSection({
  towerId,
  unitCards,
  updateUnitCard,
  copyUnitCard,
  addNewUnitCard,
}: Props) {
  const { existingUnitTypeOption } = useTowerUnitStore();
  return (
    <div>
      {unitCards && unitCards.length > 0 ? (
        unitCards.map((unitData) => (
          <div
            className='relative my-10 space-y-3 rounded-lg bg-amber-50 p-5 pb-10 shadow-[0px_0px_3px_2px_#b7791f]'
            key={unitData.id}
          >
            <h2 className='text-xl font-semibold'>Section: Unit Card</h2>
            <p className='text-center font-semibold'>
              Unit Type Card id: {unitData.id}
            </p>
            <button
              className='absolute right-2 top-0 m-2 size-8 rounded-full text-sm hover:bg-gray-300'
              type='button'
              onClick={() => {
                confirm('Are you sure?');
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
                      'flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'N' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                  >
                    <input
                      type='radio'
                      name='facing'
                      className='hidden'
                      onClick={() =>
                        updateUnitCard(towerId, unitData.id, {
                          facing: 'N',
                        })
                      }
                    />
                    <TbMapNorth size={40} strokeWidth={1.3} />
                  </label>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'S' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                  >
                    <input
                      type='radio'
                      name='facing'
                      className='hidden'
                      onClick={() =>
                        updateUnitCard(towerId, unitData.id, {
                          facing: 'S',
                        })
                      }
                    />
                    <TbMapSouth size={40} strokeWidth={1.3} />
                  </label>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'E' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                  >
                    <input
                      type='radio'
                      name='facing'
                      className='hidden'
                      onClick={() =>
                        updateUnitCard(towerId, unitData.id, {
                          facing: 'E',
                        })
                      }
                    />
                    <TbMapEast size={40} strokeWidth={1.3} />
                  </label>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.facing === 'W' &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                  >
                    <input
                      type='radio'
                      name='facing'
                      className='hidden'
                      onClick={() =>
                        updateUnitCard(towerId, unitData.id, {
                          facing: 'W',
                        })
                      }
                    />
                    <TbMapWest size={40} strokeWidth={1.3} />
                  </label>
                </div>
                <div className='ml-60 flex items-center gap-2'>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded border-2 p-1',
                      unitData.corner &&
                        'border-amber-800 bg-amber-600 text-white'
                    )}
                    title='Corner flag'
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
                    <CornerIcon className='size-9' />
                  </label>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <span className='flex-[2]'>Config:</span>
              <div className='ml-3 flex w-full flex-[5] items-center gap-2'>
                <Select
                  className='w-full'
                  instanceId={nanoid()}
                  options={[]}
                  defaultValue={unitData.configName}
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, { configName: e })
                  }
                />
                <span title='Is this configuration verified?'>
                  <BadgeCheckIcon className='size-8' />
                </span>
                <input
                  type='checkbox'
                  defaultChecked={unitData.configVerified}
                  className='toggle toggle-success'
                  title='Is this configuration verified?'
                  onChange={(e) =>
                    updateUnitCard(towerId, unitData.id, {
                      configVerified: e.target.checked,
                    })
                  }
                />
              </div>
            </div>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Tower Floor Name:</span>
              <input
                className={inputBoxClass}
                defaultValue={unitData.towerFloorName}
                onChange={(e) =>
                  updateUnitCard(towerId, unitData.id, {
                    towerFloorName: e.target.value,
                  })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Unit Floor Count:</span>
              <input
                className={inputBoxClass}
                defaultValue={unitData.unitFloorCount}
                onChange={(e) =>
                  updateUnitCard(towerId, unitData.id, {
                    unitFloorCount: +e.target.value,
                  })
                }
              />
            </label>
            <label className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Unit Nos:</span>
              <input
                className={inputBoxClass}
                defaultValue={unitData.unitNos}
                onChange={(e) =>
                  updateUnitCard(towerId, unitData.id, {
                    unitNos: e.target.value,
                  })
                }
              />
            </label>
            <div className='absolute -bottom-4 -left-0 z-10 flex w-full items-center'>
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
