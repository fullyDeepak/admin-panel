import { inputBoxClass } from '@/app/constants/tw-class';
import { FormTowerDetailType } from '@/types/types';

interface TowerUnitDetailsProps {
  towerData: FormTowerDetailType;
  updateTowerForm: (
    _id: number,
    _key: keyof FormTowerDetailType,
    _value: any
  ) => void;
  towersFormData: FormTowerDetailType[];
}

export default function TowerUnitDetails({
  towerData: tower,
  updateTowerForm,
  towersFormData: towerFormData,
}: TowerUnitDetailsProps) {
  const alphaToVal = (s: string) => s.toUpperCase().charCodeAt(0) - 64;
  const valToAlpha = (n: number) => (n + 9).toString(36).toUpperCase();

  function generateTower(cardId: number) {
    const validTableData: string[][] = [];
    towerFormData.map((item) => {
      if (item.id === cardId) {
        const deleteUnitList: string[] = [];
        item?.deleteFullUnitNos
          ?.split(',')
          ?.map((item) =>
            item.trim() ? deleteUnitList.push(item.trim()) : ''
          );
        const exceptionUnitList: string[] = [];
        item.exceptionUnitNos
          ?.split(',')
          ?.map((item) =>
            item.trim() ? exceptionUnitList.push(item.trim()) : ''
          );
        const maxFloor = +item.maxFloor;
        const minFloor = +item.minFloor;
        const unitMin = item.typicalFloorUnitNoMin;
        const unitMax = item.typicalFloorUnitNoMax;
        const gfName = item.groundFloorName;
        const gFMin = item.groundFloorUnitNoMin;
        const gFMax = item.groundFloorUnitNoMax;
        exceptionUnitList?.map((item) => {
          if (item.includes('PH') || item.includes('Penthouse')) {
            validTableData.push([item]);
          }
        });
        // [x] unit min-max rules
        for (let i = maxFloor; i >= minFloor; i--) {
          const temp = [];
          console.log('UNITMIN->', unitMin);
          if (
            typeof unitMax === 'string' &&
            typeof unitMin === 'string' &&
            unitMin.includes('0')
          ) {
            for (let j = parseInt(unitMin); j <= parseInt(unitMax); j++) {
              let unit = '';
              unit = j <= 9 ? `${i}0${j}` : `${i}${j}`;
              if (deleteUnitList.includes(unit)) {
                continue;
              }
              temp.push(unit);
            }
          } else if (
            Boolean(+unitMax) === true &&
            Boolean(+unitMin) === true &&
            typeof unitMax === 'string' &&
            typeof unitMin === 'string'
          ) {
            console.log('applying rule 2');
            for (let j = parseInt(unitMin); j <= parseInt(unitMax); j++) {
              let unit = '';
              unit = `${i}${j}`;
              if (deleteUnitList.includes(unit)) {
                continue;
              }
              temp.push(unit);
            }
          } else if (
            typeof unitMax === 'string' &&
            typeof unitMin === 'string'
          ) {
            console.log('applying rule 3');
            for (let j = alphaToVal(unitMin); j <= alphaToVal(unitMax); j++) {
              let unit = '';
              unit = `${i}${valToAlpha(j)}`;
              if (deleteUnitList.includes(unit)) {
                continue;
              }
              temp.push(unit);
            }
          }
          validTableData.push(temp);
        }
        exceptionUnitList.map((item) => {
          if (!item.includes('PH') && !item.includes('Penthouse')) {
            validTableData.push([item]);
          }
        });
        // [x] gf min-max rules
        if (gFMin && gFMax) {
          const temp = [];
          if (
            typeof gFMax === 'string' &&
            typeof gFMin === 'string' &&
            gFMin.includes('0')
          ) {
            for (let g = parseInt(gFMin); g <= parseInt(gFMax); g++) {
              let unit = '';
              unit = g <= 9 ? `${gfName}0${g}` : `${gfName}${g}`;
              if (deleteUnitList.includes(unit)) {
                continue;
              }
              temp.push(unit);
            }
          } else if (
            Boolean(+gFMax) === true &&
            Boolean(+gFMin) === true &&
            typeof gFMax === 'string' &&
            typeof gFMin === 'string'
          ) {
            for (let g = parseInt(gFMin); g <= parseInt(gFMax); g++) {
              let unit = '';
              unit = gfName ? `${gfName}${g}` : `${g}`;
              if (deleteUnitList.includes(unit)) {
                continue;
              }
              temp.push(unit);
            }
          } else if (typeof gFMax === 'string' && typeof gFMin === 'string') {
            for (let g = alphaToVal(gFMin); g <= alphaToVal(gFMax); g++) {
              let unit = '';
              unit = `${gfName}${valToAlpha(g)}`;
              if (deleteUnitList.includes(unit)) {
                continue;
              }
              temp.push(unit);
            }
          }
          validTableData.push(temp);
        }
        console.log(validTableData);
        updateTowerForm(item.id, 'validTowerUnits', validTableData);
      }
    });
  }
  return (
    <section className='flex flex-col gap-2'>
      <h3 className='my-4 text-2xl font-semibold'>
        Section: Unit Generator Data
      </h3>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Min Floor:</span>
        </span>
        <input
          className={inputBoxClass}
          name='maxFloor'
          defaultValue={tower.minFloor ? tower.minFloor : ''}
          onChange={(e) =>
            updateTowerForm(tower.id, 'minFloor', e.target.value)
          }
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Max Floor:</span>
        </span>
        <input
          className={inputBoxClass}
          name='maxFloor'
          defaultValue={tower.maxFloor ? tower.maxFloor : ''}
          onChange={(e) =>
            updateTowerForm(tower.id, 'maxFloor', e.target.value)
          }
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Ground Floor Name:</span>
        </span>
        <input
          className={inputBoxClass}
          name='groundFloorName'
          defaultValue={tower.groundFloorName}
          onChange={(e) =>
            updateTowerForm(tower.id, 'groundFloorName', e.target.value)
          }
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Ground Floor Unit Nos.:</span>
        </span>
        <span className='flex flex-[5] flex-row gap-5'>
          <input
            className={
              'w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
            }
            name='groundFloorUnitNoMin'
            defaultValue={
              tower.groundFloorUnitNoMin ? tower.groundFloorUnitNoMin : ''
            }
            placeholder='Min Value'
            onChange={(e) =>
              updateTowerForm(tower.id, 'groundFloorUnitNoMin', e.target.value)
            }
          />
          <input
            className={inputBoxClass}
            name='groundFloorUnitNoMax'
            defaultValue={
              tower.groundFloorUnitNoMax ? tower.groundFloorUnitNoMax : ''
            }
            placeholder='Max Value'
            onChange={(e) =>
              updateTowerForm(tower.id, 'groundFloorUnitNoMax', e.target.value)
            }
          />
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Typical Floor Unit Nos.:</span>
        </span>
        <span className='flex flex-[5] flex-row gap-5'>
          <input
            className={
              'w-full flex-[5] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600'
            }
            name='typicalFloorUnitNoMin'
            defaultValue={
              tower.typicalFloorUnitNoMin ? tower.typicalFloorUnitNoMin : ''
            }
            placeholder='Min Value'
            onChange={(e) =>
              updateTowerForm(tower.id, 'typicalFloorUnitNoMin', e.target.value)
            }
          />
          <input
            className={inputBoxClass}
            name='typicalFloorUnitNoMax'
            defaultValue={
              tower.typicalFloorUnitNoMax ? tower.typicalFloorUnitNoMax : ''
            }
            placeholder='Max Value'
            onChange={(e) =>
              updateTowerForm(tower.id, 'typicalFloorUnitNoMax', e.target.value)
            }
          />
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Delete Full Unit Nos.:</span>
        </span>
        <input
          className={inputBoxClass}
          name='deleteFullUnitNos'
          defaultValue={tower.deleteFullUnitNos}
          onChange={(e) =>
            updateTowerForm(tower.id, 'deleteFullUnitNos', e.target.value)
          }
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex flex-[2] items-center'>
          <span>Add Exception Unit Nos.:</span>
        </span>
        <input
          className={inputBoxClass}
          name='exceptionUnitNos'
          defaultValue={tower.exceptionUnitNos}
          onChange={(e) =>
            updateTowerForm(tower.id, 'exceptionUnitNos', e.target.value)
          }
        />
      </label>
      <button
        className='btn btn-outline btn-sm w-1/2 self-center border-none bg-violet-500 text-white hover:border-none hover:bg-violet-600'
        type='button'
        onClick={() => generateTower(tower.id)}
      >
        Generate Tower
      </button>
      <div className='flex w-full flex-col justify-between overflow-x-auto'>
        {tower.validTowerUnits?.map((row, i) => (
          <div key={i} className='flex flex-row items-start text-lg'>
            {row.map((item, j) => (
              <p key={j} className='min-w-32 border px-4 py-2 text-center'>
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
