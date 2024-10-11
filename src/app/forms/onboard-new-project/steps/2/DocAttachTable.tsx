export async function DocAttachTable({
  data,
  setData,
}: {
  headers: { label: string; filterType: 'TEXT' }[];
  data: Record<string, any>[];
  setData: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
}) {
  return (
    <table className='relative w-full border-collapse bg-white text-sm text-gray-700'>
      <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50'>
        <tr>
          <th className='z-0 w-36 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Doc ID
          </th>
          <th className='z-0 w-40 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Doc ID Schedule
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Deed Type
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            CP1
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            CP2
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Extent
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Occurrence Count
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Project Attached
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            Area Attached
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item.doc_id_schedule}
            className={`max-w-7xl cursor-pointer border-b ${item.project_attached || item.area_attached ? 'bg-sky-100 hover:bg-opacity-50' : 'bg-none hover:bg-gray-100'} select-none`}
          >
            <td className='max-w-7xl px-4 py-3'>{item.doc_id}</td>
            <td className='max-w-7xl px-4 py-3'>{item.doc_id_schedule}</td>
            <td className='max-w-7xl px-4 py-3'>{item.deed_type}</td>
            <td className='max-w-7xl px-4 py-3'>{item.cp1}</td>
            <td className='max-w-7xl px-4 py-3'>{item.cp2}</td>
            <td className='max-w-7xl px-4 py-3'>{item.extent}</td>
            <td className='max-w-7xl px-4 py-3'>{item.occurrence_count}</td>
            <td className='max-w-7xl px-4 py-3'>
              <input
                type='checkbox'
                name='project_attached'
                checked={item.project_attached}
                className='checkbox cursor-pointer'
                onChange={(e) => {
                  setData((prev) => {
                    return prev.map((ele, i) => {
                      if (i === index) {
                        return {
                          ...ele,
                          project_attached: e.target.checked,
                        };
                      }
                      return ele;
                    });
                  });
                }}
              />
            </td>
            <td className='max-w-7xl px-4 py-3'>
              <input
                type='checkbox'
                name='area_attached'
                checked={item.area_attached}
                className='checkbox cursor-pointer'
                onChange={(e) => {
                  setData((prev) => {
                    return prev.map((ele, i) => {
                      if (i === index) {
                        return {
                          ...ele,
                          area_attached: e.target.checked,
                        };
                      }
                      return ele;
                    });
                  });
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
