import Select from 'react-select';
import { inputBoxClass } from '@/app/constants/tw-class';
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import { nanoid } from 'nanoid';
import { cn, getRandomColor } from '@/lib/utils';
import { TbMapEast, TbMapNorth, TbMapSouth, TbMapWest } from 'react-icons/tb';
import { BiCopy, BiPlus } from 'react-icons/bi';
import {
  TowerUnitDetailType,
  UnitCardType,
  useTowerUnitStore,
} from '../../useTowerUnitStore';
import { CornerIcon } from './CornerIcon';
import UnitFileList from '../image/UnitFileList';
import UnitImageSelector from '../image/UnitImageSelector';

type Props = {
  towerData: TowerUnitDetailType;
  updateUnitCard: (
    _towerCardId: number,
    _unitCardId: number,
    _newDetails: Partial<UnitCardType>
  ) => void;
  copyUnitCard: (_towerCardId: number, _newDetails: UnitCardType) => void;
  addNewUnitCard: (_towerCardId: number) => void;
  deleteUnitCard: (_towerCardId: number, _unitCardId: number) => void;
};

export default function UnitSection({
  towerData,
  updateUnitCard,
  copyUnitCard,
  addNewUnitCard,
  deleteUnitCard,
}: Props) {
  const {
    existingUnitTypeOption,
    setShowTMRefTable,
    showTMRefTable,
    towerFormData,
  } = useTowerUnitStore((state) => ({
    existingUnitTypeOption: state.existingUnitTypeOption,
    setShowTMRefTable: state.setShowTMRefTable,
    showTMRefTable: state.showTMRefTable,
    towerFormData: state.towerFormData,
  }));

  return (
    <div>
      <div className='-mb-5 flex items-center gap-5'>
        <h2 className='text-xl font-semibold'>Section: Unit Card</h2>
        <button
          className='btn btn-accent btn-xs'
          onClick={() => {
            setShowTMRefTable(!showTMRefTable);
            console.log({ towerFormData });
          }}
        >
          Toggle TM Ref Table
        </button>
        <UnitImageSelector
          towerId={towerData.tower_id}
          towerImage={towerData.towerFloorPlanFile}
          unitCards={towerData.unitCards}
          updateUnitCard={updateUnitCard}
        />
      </div>
      {towerData.unitCards && towerData.unitCards.length > 0 ? (
        towerData.unitCards.map((unitData) => (
          <div
            className='relative my-10 space-y-1 rounded-lg bg-amber-50 p-5 pb-10 text-sm shadow-[0px_0px_3px_2px_#b7791f]'
            key={unitData.id}
          >
            <span
              className='absolute top-4 size-8 rounded-full bg-green-500'
              style={{ backgroundColor: getRandomColor(unitData.id, 50) }}
            ></span>
            <p className='text-center font-semibold'>
              Tower Card id: {towerData.tower_id} &nbsp; &nbsp; &nbsp; &nbsp;
              Unit Type Card id: {unitData.id}
            </p>
            <button
              className='absolute right-2 top-0 m-2 size-8 rounded-full text-sm font-semibold hover:bg-gray-300'
              type='button'
              onClick={() => {
                if (confirm('Are you sure?')) {
                  deleteUnitCard(towerData.tower_id, unitData.id);
                }
              }}
            >
              ✕
            </button>

            <div className='grid grid-cols-2 gap-x-5 gap-y-1'>
              {towerData.reraUnitTypeOption &&
                towerData.reraUnitTypeOption.length > 0 && (
                  <label className='flex flex-wrap items-center justify-between gap-5'>
                    <span className='flex-[3]'>Rera Unit Type:</span>
                    <div className='flex flex-[8]'>
                      <Select
                        className='-ml-0.5 w-full flex-1'
                        instanceId={nanoid()}
                        options={towerData.reraUnitTypeOption}
                        defaultValue={unitData.reraUnitType}
                        onChange={(e) =>
                          updateUnitCard(towerData.tower_id, unitData.id, {
                            reraUnitType: e,
                          })
                        }
                      />
                    </div>
                  </label>
                )}
              <label
                className={cn(
                  'flex flex-wrap items-center justify-between gap-5',
                  towerData.reraUnitTypeOption?.length === 0 && 'col-span-2'
                )}
              >
                <span className='flex-[2'>Existing Unit Type:</span>
                <div
                  className={cn(
                    'flex flex-[5]',
                    towerData.reraUnitTypeOption?.length === 0 && 'ml-4 w-full'
                  )}
                >
                  <Select
                    className='w-full flex-1'
                    instanceId={nanoid()}
                    options={existingUnitTypeOption}
                    value={null}
                    onChange={(e) => {
                      if (e) {
                        const [exTowerId, exUnitId] = e.value
                          .split(':')
                          .map(Number);

                        const existingCard = towerFormData
                          .find((item) => item.tower_id === exTowerId)
                          ?.unitCards.find((item) => item.id === exUnitId);

                        updateUnitCard(towerData.tower_id, unitData.id, {
                          salableArea: existingCard?.salableArea,
                          parking: existingCard?.parking,
                          extent: existingCard?.extent,
                          facing: existingCard?.facing,
                          corner: existingCard?.corner,
                          unitFloorCount: existingCard?.unitFloorCount,
                          configName: existingCard?.configName,
                          toiletConfig: existingCard?.toiletConfig,
                          otherConfig: existingCard?.otherConfig,
                          configVerified: existingCard?.configVerified,
                          doorNoOverride: existingCard?.doorNoOverride,
                          floorNos: existingCard?.floorNos,
                          unitNos: existingCard?.unitNos,
                          tmUnitType: existingCard?.tmUnitType,
                          reraUnitType: existingCard?.reraUnitType,
                        });
                      }
                    }}
                  />
                </div>
              </label>
              <div className='col-span-2 grid grid-cols-[1fr_250px_1fr] gap-5'>
                <label className='flex flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Salable Area:</span>
                  <div className='flex flex-[5] items-center gap-2'>
                    <input
                      placeholder='Value'
                      type='number'
                      className={cn(inputBoxClass, 'ml-0')}
                      defaultValue={unitData.salableArea || ''}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          salableArea: +e.target.value,
                        })
                      }
                    />
                  </div>
                </label>
                <label className='flex flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Parking:</span>
                  <div className='flex flex-[5] items-center gap-2'>
                    <input
                      placeholder='Value'
                      type='number'
                      className={cn(inputBoxClass, 'ml-0')}
                      defaultValue={unitData.parking || ''}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          parking: +e.target.value,
                        })
                      }
                    />
                  </div>
                </label>
                <label className='flex flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Extent:</span>
                  <div className='flex flex-[5] items-center gap-2'>
                    <input
                      placeholder='Value'
                      type='number'
                      className={cn(inputBoxClass, 'ml-0')}
                      defaultValue={unitData.extent || ''}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          extent: +e.target.value,
                        })
                      }
                    />
                  </div>
                </label>
              </div>
              <div className='col-span-2 grid grid-cols-[1fr_250px_1fr] gap-5'>
                <div className='flex flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Facing:</span>
                  <div className='flex flex-[5] items-center gap-2'>
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
                            updateUnitCard(towerData.tower_id, unitData.id, {
                              facing: 'N',
                            });
                          } else {
                            updateUnitCard(towerData.tower_id, unitData.id, {
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
                            updateUnitCard(towerData.tower_id, unitData.id, {
                              facing: 'S',
                            });
                          } else {
                            updateUnitCard(towerData.tower_id, unitData.id, {
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
                            updateUnitCard(towerData.tower_id, unitData.id, {
                              facing: 'E',
                            });
                          } else {
                            updateUnitCard(towerData.tower_id, unitData.id, {
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
                            updateUnitCard(towerData.tower_id, unitData.id, {
                              facing: 'W',
                            });
                          } else {
                            updateUnitCard(towerData.tower_id, unitData.id, {
                              facing: null,
                            });
                          }
                        }}
                      />
                      <TbMapWest size={30} strokeWidth={1.3} />
                    </label>
                  </div>
                </div>
                <div className='flex flex-[2] flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Corner:</span>
                  <div className='flex flex-[5]'>
                    <div className='flex items-center gap-2'>
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
                            updateUnitCard(towerData.tower_id, unitData.id, {
                              corner: e.target.checked,
                            })
                          }
                        />
                        <CornerIcon className='size-6' />
                      </label>
                    </div>
                  </div>
                </div>
                <div className='flex flex-[3] flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Unit Floor Count:</span>
                  <div className='w-full flex-[5]'>
                    <select
                      className='h-9 min-h-9 w-full flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none !pe-1 !pl-1 !pr-5 ps-3 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
                      value={unitData.unitFloorCount || undefined}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          unitFloorCount: e.target.value,
                        })
                      }
                    >
                      <option disabled selected>
                        Unit Floor
                      </option>
                      {towerData.towerType === 'APARTMENT' &&
                        ['Simplex', 'Duplex', 'Triplex'].map((item, idx) => (
                          <option value={idx + 1} key={idx}>
                            {item}
                          </option>
                        ))}
                      {towerData.towerType === 'VILLA' &&
                        ['G+1', 'G+2', 'G+3'].map((item, idx) => (
                          <option value={idx + 1} key={idx}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className='col-span-2 grid grid-cols-[1fr_250px_1fr] gap-5'>
                <div className='flex items-center gap-2'>
                  <span className='flex-[3]'>Config:</span>
                  <div className='ml-3 flex w-full flex-[5] items-center gap-2'>
                    <select
                      className='h-9 min-h-9 flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none pl-1 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
                      value={unitData.configName || undefined}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          configName: e.target.value,
                        })
                      }
                    >
                      <option disabled selected>
                        Bed
                      </option>
                      {[
                        'Studio',
                        'LOBBY',
                        '1BHK',
                        '2BHK',
                        '2.5BHK',
                        '3BHK',
                        '3.5BHK',
                        '4BHK',
                        '5BHK+',
                      ].map((item, idx) => (
                        <option value={item} key={idx}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      className='h-9 min-h-9 flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none pl-1 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
                      value={unitData.toiletConfig || undefined}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          toiletConfig: e.target.value,
                        })
                      }
                    >
                      <option disabled selected>
                        Toilet
                      </option>
                      {['1T', '2T', '3T', '3T+'].map((item, idx) => (
                        <option value={item} key={idx}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      className='h-9 min-h-9 flex-1 appearance-auto rounded-md border-[1.6px] border-gray-300 bg-white !bg-none pl-1 text-xs focus:border-[1.6px] focus:border-violet-600 focus:outline-none'
                      value={unitData.otherConfig || undefined}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          otherConfig: e.target.value,
                        })
                      }
                    >
                      <option disabled selected>
                        Other
                      </option>
                      {['Maid', 'Study', 'HT'].map((item, idx) => (
                        <option value={item} key={idx}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='flex-[3]'>Verify:</span>
                  <div className='ml-2 flex-[5]'>
                    <label className='swap swap-flip'>
                      <input
                        type='checkbox'
                        checked={unitData.configVerified}
                        className='hidden'
                        onChange={(e) =>
                          updateUnitCard(towerData.tower_id, unitData.id, {
                            configVerified: e.target.checked,
                          })
                        }
                      />
                      <span
                        className='swap-on tooltip'
                        data-tip='Configuration Verified'
                      >
                        <ShieldCheck className='size-8 text-green-600' />
                      </span>
                      <span
                        className='swap-off tooltip'
                        data-tip='Configuration NotVerified'
                      >
                        <ShieldQuestion className='size-8 text-red-600' />
                      </span>
                    </label>
                  </div>
                </div>
                <div className='flex flex-wrap items-center justify-between gap-5'>
                  <span className='flex-[3]'>Door No Override:</span>
                  <div className='flex flex-[5] items-center gap-2'>
                    <input
                      className={`${inputBoxClass} !ml-0`}
                      defaultValue={unitData.doorNoOverride}
                      onChange={(e) =>
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          doorNoOverride: e.target.value,
                        })
                      }
                      placeholder='Enter New Door No'
                    />
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-5'>
                <span className='flex-[3]'>Tower Floor Nos:</span>
                <div className='-ml-0.5 flex flex-[8] items-center gap-2'>
                  <input
                    className={`${inputBoxClass} !ml-0`}
                    defaultValue={unitData.floorNos}
                    onChange={(e) =>
                      updateUnitCard(towerData.tower_id, unitData.id, {
                        floorNos: e.target.value,
                      })
                    }
                    placeholder='Enter floor nos'
                  />
                </div>
              </div>
              <div className='flex flex-wrap items-center justify-between gap-5'>
                <span className='flex-[3]'>Unit Nos:</span>
                <div className='flex flex-[5]'>
                  <input
                    className={`${inputBoxClass} !ml-0`}
                    defaultValue={unitData.unitNos}
                    onChange={(e) =>
                      updateUnitCard(towerData.tower_id, unitData.id, {
                        unitNos: e.target.value,
                      })
                    }
                    placeholder='Enter unit nos'
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[2]'>Unit Floor Plan:</span>
              <div className='-ml-1 flex-[14]'>
                <input
                  type='file'
                  className='file-input file-input-bordered file-input-xs ml-2 h-8'
                  id='project-other-docs-file'
                  accept='image/*'
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      Array.from(e.target.files).forEach((file) => {
                        updateUnitCard(towerData.tower_id, unitData.id, {
                          unitFloorPlanFile: {
                            name: file.name,
                            file: file,
                          },
                        });
                      });
                    }
                  }}
                />
              </div>
            </div>
            <UnitFileList
              image={unitData.unitFloorPlanFile}
              towerId={towerData.tower_id}
              unitId={unitData.id}
              updateUnitCard={updateUnitCard}
              customModalSuffix={`${towerData.tower_id}-${unitData.id}-${unitData.salableArea}-${unitData.extent}`}
            />
            <div className='absolute -bottom-4 -left-0 z-[0] flex w-full items-center'>
              <button
                type='button'
                className='btn btn-sm mx-auto flex items-center border-none bg-amber-400 hover:bg-amber-500'
                onClick={() =>
                  copyUnitCard(towerData.tower_id, {
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
                onClick={() => addNewUnitCard(towerData.tower_id)}
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
              'btn-rezy mt-10 text-white',
              '!bg-amber-500 hover:!bg-amber-600'
            )}
            onClick={() => addNewUnitCard(towerData.tower_id)}
          >
            Add Unit Card
          </button>
        </div>
      )}
    </div>
  );
}
