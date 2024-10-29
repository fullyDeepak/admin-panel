import SimpleTable from '@/components/tables/SimpleTable';
import { RefTableType } from '../../useTowerUnitStore';

type Props = {
  reraRefTable: RefTableType[];
  tmRefTable: RefTableType[];
};

export default function RefTable({ reraRefTable, tmRefTable }: Props) {
  const tableColumns = [
    'Type ID',
    'Tower ID',
    'Unit Count',
    'Config',
    'Salable Area',
    'Facing',
    'Floor List',
  ];

  console.log({ reraRefTable });

  return (
    <div>
      <h3 className='text-lg font-bold'>RERA Ref Table</h3>
      <SimpleTable
        columns={tableColumns}
        tableData={reraRefTable.map((item) => [
          item.type,
          item.towerId,
          item.unitCount,
          item.config,
          item.salableArea,
          item.facing,
          item.floorList,
        ])}
      />
      <h3 className='text-lg font-bold'>TM Ref Table</h3>
      <SimpleTable
        columns={tableColumns}
        tableData={tmRefTable.map((item) => [
          item.type,
          item.towerId,
          item.unitCount,
          item.config,
          item.salableArea,
          item.facing,
          item.floorList,
        ])}
      />
    </div>
  );
}
