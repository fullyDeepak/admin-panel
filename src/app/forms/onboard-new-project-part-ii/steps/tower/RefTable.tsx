import SimpleTable from '@/components/tables/SimpleTable';
import { RefTableType } from '../../useTowerUnitStore';

type Props = {
  reraRefTable: RefTableType[];
  tmRefTable: (RefTableType & { extent: string })[];
};

export default function RefTable({ reraRefTable, tmRefTable }: Props) {
  const reraTableColumns = [
    'Type ID',
    'Tower ID',
    'Unit Count',
    'Config',
    'Salable Area',
    'Facing',
    'Floor List',
  ];
  const tmTableColumns = [
    'Type ID',
    'Tower ID',
    'Unit Count',
    'Config',
    'Salable Area',
    'Extent',
    'Facing',
    'Floor List',
  ];

  return (
    <div>
      <h3 className='text-lg font-bold'>RERA Ref Table</h3>
      <SimpleTable
        columns={reraTableColumns}
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
        columns={tmTableColumns}
        tableData={tmRefTable.map((item) => [
          item.type,
          item.towerId,
          item.unitCount,
          item.config,
          item.salableArea,
          item.extent,
          item.facing,
          item.floorList,
        ])}
      />
    </div>
  );
}
