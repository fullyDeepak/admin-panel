import { useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

export function DocAttachTable({
  data,
  setData,
}: {
  data: {
    execution_date: string;
    project_id: string;
    doc_id: string;
    deed_type: string;
    occurrence_count: string;
    cp1: string;
    cp2: string;
    extent: string;
    area_attached: boolean;
    doc_id_schedule: string;
    project_attached: boolean;
  }[];
  setData: React.Dispatch<
    React.SetStateAction<
      {
        execution_date: string;
        project_id: string;
        doc_id: string;
        deed_type: string;
        occurrence_count: string;
        cp1: string;
        cp2: string;
        extent: string;
        area_attached: boolean;
        doc_id_schedule: string;
        project_attached: boolean;
      }[]
    >
  >;
}) {
  const [filters, setFilters] = useState<{
    doc_id: string;
    doc_id_schedule: string;
    deed_type: string;
    cp1: string;
    cp2: string;
    extent: string;
    occurrence_count: {
      min: number;
      max: number;
    };
    project_attached: boolean | null;
    area_attached: boolean | null;
  }>({
    doc_id: '',
    doc_id_schedule: '',
    deed_type: '',
    cp1: '',
    cp2: '',
    extent: '',
    occurrence_count: {
      min: 0,
      max: 0,
    },
    project_attached: null,
    area_attached: null,
  });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  return (
    <table className='relative min-h-[90dvh] w-full border-collapse bg-white text-sm text-gray-700'>
      <thead className='sticky top-0 z-[1] text-nowrap bg-gray-50'>
        <tr>
          <th className='z-0 min-w-36 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>Doc ID</span>
              <span>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      doc_id: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          </th>
          <th className='z-0 min-w-36 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>Doc ID Schedule</span>
              <span>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      doc_id_schedule: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          </th>
          <th className='z-0 min-w-36 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <span>Execution Date</span>
          </th>
          <th className='z-0 min-w-36 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>Deed Type</span>
              <span>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      deed_type: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          </th>
          <th className='z-0 min-w-[30em] max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>CP1</span>
              <span>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      cp1: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          </th>
          <th className='z-0 min-w-[30em] max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>CP2</span>
              <span>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      cp2: e.target.value,
                    }))
                  }
                />
              </span>
            </div>
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>Extent</span>
              <span className='flex justify-between'>
                {sortDirection === 'asc' ? (
                  <BiChevronDown
                    className='h-12 w-12 text-gray-400'
                    onClick={() => setSortDirection('desc')}
                  />
                ) : (
                  <BiChevronUp
                    className='h-12 w-12 text-gray-400'
                    height={20}
                    width={20}
                    onClick={() => setSortDirection('asc')}
                  />
                )}
              </span>
            </div>
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col'>
              <span>Occurrence Count</span>
              <span>
                <input
                  type='text'
                  className='input input-bordered w-12'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      occurrence_count: {
                        min: +e.target.value,
                        max: +filters.occurrence_count.max,
                      },
                    }))
                  }
                />
                <span> to </span>
                <input
                  type='text'
                  className='input input-bordered w-12'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      occurrence_count: {
                        max: +e.target.value,
                        min: +filters.occurrence_count.min,
                      },
                    }))
                  }
                />
              </span>
            </div>
          </th>
          <th className='z-0 max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col gap-5'>
              <span>Project Attached</span>
              <span className='flex justify-between'>
                <input
                  type='checkbox'
                  className='checkbox'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      project_attached: e.target.checked,
                    }))
                  }
                />
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      project_attached: null,
                    }))
                  }
                >
                  Clear
                </button>
              </span>
            </div>
          </th>
          <th className='z-0 h-full max-w-7xl px-4 py-4 font-semibold text-gray-900'>
            <div className='flex flex-col gap-5'>
              <span>Area Attached</span>
              <span className='flex justify-between'>
                <input
                  type='checkbox'
                  className='checkbox'
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      area_attached: e.target.checked,
                    }))
                  }
                />
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      area_attached: null,
                    }))
                  }
                >
                  Clear
                </button>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter((ele) => {
            return (
              ele.doc_id.includes(filters.doc_id) &&
              ele.doc_id_schedule.includes(filters.doc_id_schedule) &&
              ele.deed_type.includes(filters.deed_type) &&
              ele.cp1.includes(filters.cp1) &&
              ele.cp2.includes(filters.cp2) &&
              ele.extent.includes(filters.extent) &&
              (filters.project_attached === null ||
                ele.project_attached === filters.project_attached) &&
              (filters.area_attached === null ||
                ele.area_attached === filters.area_attached) &&
              (filters.occurrence_count.min === 0 ||
                parseInt(ele.occurrence_count) >=
                  filters.occurrence_count.min) &&
              (filters.occurrence_count.max === 0 ||
                parseInt(ele.occurrence_count) <= filters.occurrence_count.max)
            );
          })
          .sort((a, b) => {
            if (!sortDirection) {
              return -1;
            }

            if (sortDirection === 'asc') {
              return parseFloat(a.extent) - parseFloat(b.extent);
            }

            return parseFloat(b.extent) - parseFloat(a.extent);
          })
          .map((item) => (
            <tr
              key={item.doc_id_schedule}
              className={`max-w-7xl cursor-pointer border-b ${item.project_attached || item.area_attached ? 'bg-sky-100 hover:bg-opacity-50' : 'bg-none hover:bg-gray-100'} select-none`}
            >
              <td className='max-w-7xl px-4 py-3'>{item.doc_id}</td>
              <td className='max-w-7xl px-4 py-3'>{item.doc_id_schedule}</td>
              <td className='max-w-7xl px-4 py-3'>{item.execution_date}</td>
              <td className='max-w-7xl px-4 py-3'>{item.deed_type}</td>
              <td className='max-w-7xl break-all px-4 py-3'>{item.cp1}</td>
              <td className='max-w-7xl break-all px-4 py-3'>{item.cp2}</td>
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
                      return prev.map((ele) => {
                        if (ele.doc_id_schedule === item.doc_id_schedule) {
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
                      return prev.map((ele) => {
                        if (ele.doc_id_schedule === item.doc_id_schedule) {
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
