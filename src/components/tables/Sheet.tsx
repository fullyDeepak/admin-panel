'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import { MdDelete } from 'react-icons/md';

export default function Sheet(
  props: {
    data: string[][];
    height: string;
    rows?: number;
    showHeaders?: boolean;
  } & (
    | { deleteOption: false; setSheetData?: never }
    // eslint-disable-next-line no-unused-vars
    | { deleteOption: true; setSheetData: (value: string[][]) => void }
  )
) {
  if (!props.data) return <></>;
  const height = props?.height || '70vh';
  const sheetData = props?.data?.slice(0, props.rows);
  const headerSet = sheetData?.reduce((set, obj) => {
    Object.keys(obj).forEach((key) => set.add(key));
    return set;
  }, new Set<string>());

  const headerArray = Array.from(headerSet);

  const columns = headerArray.map((item) => (
    <Column
      key={item}
      field={item.toString()}
      // className='whitespace-nowrap'
      header={item.toString().toUpperCase().replace('_', ' ')}
      body={(rowData) => rowData[item] || 0}
    ></Column>
  ));

  const actionBody = (rowData: string[][]) => {
    return (
      <button
        className='group btn btn-circle btn-outline btn-error btn-sm'
        type='button'
      >
        <MdDelete
          size={20}
          className='group-hover:text-white'
          onClick={() => {
            props?.setSheetData &&
              props?.setSheetData(
                sheetData.filter(
                  (item) => JSON.stringify(item) !== JSON.stringify(rowData)
                )
              );
          }}
        />
      </button>
    );
  };

  return (
    <div className='flex-1'>
      <DataTable
        scrollable
        scrollHeight={height}
        showGridlines
        size='small'
        className='z-0'
        value={sheetData}
        showHeaders={props.showHeaders === false ? false : true}
        // className='max-h-[50vh] md:max-h-[70vh] overflow-y-scroll'
      >
        {columns}
        {props?.deleteOption && (
          <Column
            body={actionBody}
            className='flex items-center justify-center px-3'
          ></Column>
        )}
      </DataTable>
    </div>
  );
}
