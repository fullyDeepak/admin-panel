type SimpleTableProps = {
  columns: string[];
  tableData: string[][];
};

export default function SimpleTable({ columns, tableData }: SimpleTableProps) {
  return (
    <div className='m-5 mt-0 max-h-[40vh] overflow-x-auto rounded-lg border border-gray-300 shadow-md'>
      <table className='relative w-full border-collapse bg-white text-sm text-gray-700'>
        <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50 ring-1 ring-slate-200'>
          <tr>
            {columns.map((col, index) => (
              <th
                scope='col'
                className='text-nowrap px-6 py-4 text-center font-semibold text-gray-900'
                key={index}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100 border-t border-gray-100'>
          {tableData.map((row, index) => (
            <tr className='hover:bg-gray-50' key={index}>
              {row.map((item, index) => (
                <td className='px-6 py-4' key={index}>
                  {item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
