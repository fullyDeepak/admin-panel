'use client';

import { useEffect } from 'react';

import { useTowerUnitStore } from '../../useTowerUnitStore';
import UnitSection from './UnitSection';
import RefTable from './RefTable';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import TowerDetails from './TowerDetails';

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
  } = useTowerUnitStore();

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

  return (
    <div className='flex flex-col text-sm'>
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
  );
}
