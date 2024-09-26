'use client';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import Select, { SingleValue } from 'react-select';
export default function Page() {
  // states
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedMandal, setSelectedMandal] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: number;
  } | null>();
  const [districtOptions, setDistrictOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [mandalOptions, setMandalOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [villageOptions, setVillageOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);
  const [dmvData, setDmvData] = useState<
    | {
        district_id: number;
        district_name: string;
        mandals: {
          mandal_id: number;
          mandal_name: string;
          villages: { village_id: number; village_name: string }[];
        }[];
      }[]
    | null
  >(null);
  const [selectedProject, setSelectedProject] = useState<
    SingleValue<{
      label: string;
      value: string;
    }>
  >();
  const [projectOptions, setProjectOptions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [rootDocOptions, setRootDocOptions] = useState<
    {
      doc_id: string;
      doc_id_schedule: string;
      deed_type: string;
      cp1: string;
      cp2: string;
      extent: string;
      occurrence_count: number;
      attached: boolean;
    }[]
  >([]);
  // queries
  const { isLoading: isLoadingDMV, isError: isErrorDMV } = useQuery({
    queryKey: ['village-project-cleaner-developer-tagger'],
    queryFn: async () => {
      const res = await axiosClient.get<{
        data: {
          state_name: string;
          state_id: number;
          districts: {
            district_id: number;
            district_name: string;
            mandals: {
              mandal_id: number;
              mandal_name: string;
              villages: { village_id: number; village_name: string }[];
            }[];
          }[];
        }[];
      }>('/forms/getOnboardedSDMV');
      console.log(res.data.data);
      const telanganaData = res.data.data.find(
        (item) => item.state_id === 36
      )?.districts;
      if (!telanganaData) return null;
      setDmvData(telanganaData);
      const districtOpts = telanganaData.map((item) => ({
        label: `${item.district_id}:${item.district_name}`,
        value: item.district_id,
      }));
      setDistrictOptions(districtOpts);
      return res.data.data;
    },
    staleTime: Infinity,
  });

  const {
    isLoading: loadingProjects,
    isError,
    error,
  } = useQuery({
    queryKey: ['projects-root-doc-cleaner', selectedVillage],
    queryFn: async () => {
      if (!selectedVillage) return null;
      const res = await axiosClient.get<{
        data: {
          id: string;
          name: string;
        }[];
      }>('/cleaners/projects?village_id=' + selectedVillage?.value);
      const tempProjects = res.data.data.map((item) => ({
        label: `${item.id}:${item.name}`,
        value: item.id,
      }));
      setProjectOptions(tempProjects);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: rootDocs, isLoading: loadingRootDocs } = useQuery({
    queryKey: ['projects-root-docs', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return null;
      const res = await axiosClient.get<{
        data: {
          doc_id: string;
          doc_id_schedule: string;
          deed_type: string;
          cp1: string;
          cp2: string;
          extent: string;
          occurrence_count: number;
          attached: boolean;
        }[];
      }>(
        '/cleaners/root-docs?project_id=' +
          selectedProject?.value +
          `&project_type=${selectedProject.value.charAt(0) === 'O' ? 'ONBOARDED' : 'TEMP'}`
      );
      const rootDocs = res.data.data;
      setRootDocOptions(rootDocs);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  return isLoadingDMV ? (
    <div className='flex h-[50dvh] flex-col items-center justify-center'>
      <LuLoader2 size={40} className='animate-spin' />
      <div className='text-5xl font-bold'>Loading DMVs...</div>
    </div>
  ) : isErrorDMV ? (
    <div className='flex h-[50dvh] flex-col items-center justify-center'>
      <LuLoader2 size={40} className='animate-spin' />
      <div className='text-5xl font-bold'>Error loading DMVs...</div>
    </div>
  ) : (
    <>
      <div className='mb-8 mt-10 flex flex-col justify-center'>
        <h1 className='mb-4 text-center text-3xl font-semibold underline'>
          Developer Tagger Cleaner
        </h1>
        <div className='z-10 mt-5 flex w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>District:</span>
            <Select
              className='w-full flex-[5]'
              key={'district'}
              options={districtOptions || []}
              value={selectedDistrict}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedDistrict(e);
                console.log('district changed', e);
                if (e) {
                  const mandalOpts = dmvData
                    ?.find((item) => item.district_id === e.value)
                    ?.mandals.map((item) => ({
                      label: `${item.mandal_id}:${item.mandal_name}`,
                      value: item.mandal_id,
                    }));
                  console.log('mandal options', mandalOpts);
                  setMandalOptions(mandalOpts || []);
                } else {
                  setMandalOptions([]);
                }
                setSelectedMandal(null);
              }}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>Mandal:</span>
            <Select
              className='w-full flex-[5]'
              key={'mandal'}
              options={mandalOptions || []}
              value={selectedMandal}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedMandal(e);
                console.log('mandal changed', e);
                if (e) {
                  console.log(
                    dmvData
                      ?.find(
                        (item) => item.district_id === selectedDistrict?.value
                      )
                      ?.mandals.find((item) => item.mandal_id === e.value)
                  );
                  const villageOpts = dmvData
                    ?.find(
                      (item) => item.district_id === selectedDistrict?.value
                    )
                    ?.mandals.find((item) => item.mandal_id === e.value)
                    ?.villages.map((item) => ({
                      label: `${item.village_id}:${item.village_name}`,
                      value: item.village_id,
                    }));
                  console.log('village options', villageOpts);
                  setVillageOptions(villageOpts || []);
                } else {
                  setVillageOptions([]);
                }
                setSelectedVillage(null);
              }}
              isDisabled={Boolean(!selectedDistrict)}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>Village:</span>
            <Select
              className='w-full flex-[5]'
              key={'village'}
              options={villageOptions || []}
              value={selectedMandal ? selectedVillage : null}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: number;
                }>
              ) => {
                setSelectedVillage(e);
                setSelectedProject(null);
                setRootDocOptions([]);
              }}
              isDisabled={Boolean(!selectedMandal)}
            />
          </label>
          <label className='flex items-center justify-between gap-5'>
            <span className='flex-[2] text-base md:text-xl'>
              Select Project Name:
            </span>
            <Select
              className='w-full flex-[5]'
              key={'tempProject'}
              options={projectOptions || []}
              value={selectedProject || []}
              noOptionsMessage={(_i) => {
                return isError ? error.message : 'No Raw';
              }}
              isLoading={loadingProjects}
              onChange={(
                e: SingleValue<{
                  label: string;
                  value: string;
                }>
              ) => {
                setSelectedProject(e);
                document.getElementById('keywords-container')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              isDisabled={Boolean(!selectedVillage)}
            />
          </label>
        </div>
      </div>
      {loadingRootDocs ? (
        <div className='flex h-[50dvh] flex-col items-center justify-center'>
          <LuLoader2 size={40} className='animate-spin' />
          <span>Loading Root Docs</span>
        </div>
      ) : !rootDocs ? (
        <div className='flex flex-col items-center justify-center text-2xl font-semibold'>
          <span>No Root Docs found</span>
        </div>
      ) : (
        <div className='m-5 overflow-x-auto rounded-lg border border-gray-200 shadow-md'>
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
                  Attached
                </th>
              </tr>
            </thead>
            <tbody>
              {rootDocOptions.map((item, index) => (
                <tr
                  key={item.doc_id_schedule}
                  className={`max-w-7xl cursor-pointer border-b ${item.attached ? 'bg-sky-100 hover:bg-opacity-50' : 'bg-none hover:bg-gray-100'} select-none`}
                  onClick={async () => {
                    await axiosClient.post(
                      '/cleaners/toggle-root-doc-attach-status',
                      {
                        project_id:
                          selectedProject?.value.charAt(0) === 'O'
                            ? selectedProject?.value.replace('O', '')
                            : selectedProject?.value,
                        project_type:
                          selectedProject?.value.charAt(0) === 'O'
                            ? 'ONBOARDED'
                            : 'TEMP',
                        root_doc_id: item.doc_id,
                      }
                    );
                    setRootDocOptions((prev) => {
                      return prev.map((ele, i) => {
                        if (i === index) {
                          return {
                            ...ele,
                            attached: !ele.attached,
                          };
                        }
                        return ele;
                      });
                    });
                  }}
                >
                  <td className='max-w-7xl px-4 py-3'>{item.doc_id}</td>
                  <td className='max-w-7xl px-4 py-3'>
                    {item.doc_id_schedule}
                  </td>
                  <td className='max-w-7xl px-4 py-3'>{item.deed_type}</td>
                  <td className='max-w-7xl px-4 py-3'>{item.cp1}</td>
                  <td className='max-w-7xl px-4 py-3'>{item.cp2}</td>
                  <td className='max-w-7xl px-4 py-3'>{item.extent}</td>
                  <td className='max-w-7xl px-4 py-3'>
                    {item.occurrence_count}
                  </td>
                  <td className='max-w-7xl px-4 py-3'>
                    <input
                      type='checkbox'
                      name='attached'
                      checked={item.attached}
                      className='checkbox cursor-pointer'
                      onChange={(e) => {
                        setRootDocOptions((prev) => {
                          return prev.map((ele, i) => {
                            if (i === index) {
                              return {
                                ...ele,
                                attached: e.target.checked,
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
        </div>
      )}
    </>
  );
}
