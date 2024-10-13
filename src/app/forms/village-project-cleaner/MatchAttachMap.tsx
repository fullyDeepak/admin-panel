// @ts-expect-error  third party
import Select from 'react-select-virtualized';
import { LuLoader } from 'react-icons/lu';
import { useVillageProjectCleanerStore } from './useVillageProjectCleanerStore';
import { RawAptDataRow, rawAptSelectionColumns } from './table-columns';
import TanstackReactTable from './Table';
import { SetStateAction, useState } from 'react';
import { SingleValue } from 'react-select';
import toast from 'react-hot-toast';
import { inputBoxClass } from '@/app/constants/tw-class';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import MapUI, { ProjectCordWithinVillage } from './MapUI';

type Props = {
  loadingRawAptDictData: boolean;
  rawAptDictData: RawAptDataRow[] | null | undefined;
  rawAptNames: RawAptDataRow[];
  setCleanedRows: (
    _value: SetStateAction<
      (RawAptDataRow & {
        clean_apt_name: string;
        selected_project_id: string;
        project_category: string;
        project_subtype: string;
      })[]
    >
  ) => void;
};

export default function MatchAttachMap({
  loadingRawAptDictData,
  rawAptDictData,
  rawAptNames,
  setCleanedRows,
}: Props) {
  const {
    selectedDMV,
    cleanAptName,
    setCleanAptName,
    setMapData,
    setAttachedMapData,
    selectedMapProject,
    setSelectedMapProject,
    submitMapData,
    selectedCleanProjectId,
    setSelectedCleanProjectId,
  } = useVillageProjectCleanerStore();
  const [selectedRows, setSelectedRows] = useState<RawAptDataRow[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  // const [cleanAptName, setCleanAptName] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(true);
  const [selectedCleanApartmentOption, setSelectedCleanApartmentOption] =
    useState<SingleValue<{ label: string; value: string }>>({
      label: 'Select Apartment',
      value: '',
    });

  // use query
  const { data: cleanAptCandidates, isLoading: loadingCleanAptCandidates } =
    useQuery({
      queryKey: ['clean-apt-candidates', selectedDMV.village],
      queryFn: async () => {
        if (!selectedDMV.village) return null;
        const res = await axiosClient.get<{
          data: {
            temp_project_id: string;
            project_name: string;
          }[];
        }>(
          '/forms/clean-project-name-candidates?village_id=' +
            selectedDMV.village?.value
        );
        return res.data.data.map((item) => ({
          label: item.project_name,
          value: item.temp_project_id ? item.temp_project_id : '__new',
        }));
      },
    });

  async function handleShowOnMap() {
    if (!selectedDMV.village || !cleanAptName) return;
    setMapData(null);
    const res = axiosClient.get<ProjectCordWithinVillage>(
      '/map/project-cord-within-village',
      {
        params: {
          village_id: selectedDMV.village.value,
          query: `${cleanAptName} ${selectedDMV.village.label.split(':')[1]}`,
        },
      }
    );
    toast.promise(
      res,
      {
        loading: 'Loading...',
        success: (data) => {
          setMapData(data.data.data);
          return `Successfully loaded ${data.data.data.length} projects.`;
        },
        error: 'Error',
      },
      { duration: 5000 }
    );
  }

  return (
    <div className='mt-10 flex flex-col'>
      {cleanAptName ? (
        <h2
          id='heading-label'
          className='bg-success text-center text-2xl font-semibold'
        >
          Raw Apt Dict (Select Raw Apartment Names for &apos;
          {cleanAptName}&apos;){' '}
          {selectedCleanProjectId === '__new'
            ? 'A New Temp Project Id will be generated.'
            : `${selectedCleanProjectId} will be assigned.`}
        </h2>
      ) : (
        <h2
          id='heading-label'
          className='bg-error text-center text-2xl font-semibold'
        >
          Select Clean Apartment Name to Tag Raw Apartment Name With
        </h2>
      )}
      <div className='flex max-h-screen gap-5 px-4'>
        {loadingRawAptDictData ? (
          <div className='flex h-[50dvh] flex-col items-center justify-center'>
            <LuLoader size={40} className='animate-spin' />
            <div className='text-5xl font-bold'>Loading Raw Apt Dict...</div>
          </div>
        ) : (
          rawAptDictData &&
          rawAptDictData?.length > 0 && (
            <div className='w-[60%]'>
              <TanstackReactTable
                data={rawAptNames}
                columns={rawAptSelectionColumns}
                setSelectedRows={setSelectedRows}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                isMultiSelection={true}
              />
            </div>
          )
        )}
        {selectedDMV.village?.value && (
          <div className='flex h-[80vh] w-full flex-col items-center'>
            <div className='flex w-full flex-col items-center justify-center'>
              <div className='px z-10 mt-5 flex w-full max-w-full flex-col items-center justify-center gap-3 self-center rounded p-0 px-10 py-3 align-middle shadow-none md:max-w-[90%] md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                <Select
                  key={'clean-apt'}
                  className='w-full max-w-[600px]'
                  options={cleanAptCandidates || []}
                  isLoading={loadingCleanAptCandidates}
                  value={selectedCleanApartmentOption}
                  onChange={(
                    e: SingleValue<{
                      label: string;
                      value: string;
                    }>
                  ) => {
                    if (!e) {
                      toast.error('Select an Apartment or enter one.');
                      return;
                    }
                    console.log('Selected Clean Apartment', e);
                    setCleanAptName(e?.label.split(':')[1].trim() || null);
                    setSelectedCleanProjectId(e?.value);
                    document.getElementById('heading-label')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                    setShowWarning(false);
                  }}
                />
                <input
                  type='text'
                  className={inputBoxClass + ' !ml-0 !w-full'}
                  placeholder='Enter Clean Apartment Name'
                  value={cleanAptName || ''}
                  onChange={(e) => {
                    setSelectedCleanProjectId('__new');
                    setCleanAptName(e.target.value);
                    setShowWarning(true);
                  }}
                />
                {cleanAptCandidates &&
                  cleanAptCandidates.length > 0 &&
                  cleanAptCandidates.find(
                    (item) =>
                      item.label.split(':')[1].trim().toUpperCase() ===
                      cleanAptName?.toUpperCase()
                  ) &&
                  showWarning && (
                    <p className='flex flex-col text-center text-2xl font-semibold'>
                      <span>Selected Apartment is already in the list.</span>
                      <button
                        className='btn btn-neutral mx-auto my-5 w-40'
                        onClick={() => {
                          const toSet = cleanAptCandidates.find(
                            (item) =>
                              item.label.split(':')[1].trim().toUpperCase() ===
                              cleanAptName?.toUpperCase()
                          );
                          if (toSet) {
                            setSelectedCleanApartmentOption(toSet);
                            setCleanAptName(toSet.label.split(':')[1].trim());
                            setSelectedCleanProjectId(toSet.value);
                            setShowWarning(false);
                          }
                        }}
                      >
                        Select That Project?
                      </button>
                    </p>
                  )}
              </div>
              <div className='flex items-center justify-between gap-4'>
                <button
                  className='btn btn-warning'
                  type='button'
                  onClick={handleShowOnMap}
                >
                  Show on Map
                </button>
                <button
                  className='btn btn-neutral mx-auto my-5 w-40'
                  onClick={async () => {
                    if (!cleanAptName) {
                      toast.error('Select an Apartment or enter one.');
                      return;
                    }
                    if (selectedRows.length === 0) {
                      toast.error('Select Raw Apartment or enter one.');
                      return;
                    }
                    const newTempId = (
                      await axiosClient.get<{
                        data: string;
                      }>('/forms/get-new-temp-id')
                    ).data.data;
                    const idToBeAssign =
                      selectedCleanProjectId === '__new'
                        ? newTempId
                        : selectedCleanProjectId;
                    setAttachedMapData(idToBeAssign, {
                      village_id: selectedDMV.village?.value,
                      place_id: selectedMapProject?.place_id,
                      full_address: selectedMapProject?.description,
                      pincode: selectedMapProject?.pincode,
                      lng: selectedMapProject?.geometry.location.lng,
                      lat: selectedMapProject?.geometry.location.lat,
                    });
                    setCleanedRows((prev) => {
                      return [
                        ...prev,
                        ...selectedRows.map((item) => ({
                          ...item,
                          clean_apt_name: cleanAptName,
                          selected_project_id: idToBeAssign,
                          project_category: '',
                          project_subtype: '',
                        })),
                      ];
                    });
                    setSelectedMapProject(null);
                    setMapData(null);
                    setRowSelection({});
                    setCleanAptName('');
                    setShowWarning(true);
                    document
                      .getElementById('cleaned-apartment-data')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                  }}
                >
                  Attach
                </button>
                <button
                  className='btn btn-accent'
                  onClick={() => {
                    if (
                      selectedCleanProjectId.startsWith('T') ||
                      selectedCleanProjectId.startsWith('R')
                    ) {
                      setAttachedMapData(selectedCleanProjectId, {
                        village_id: selectedDMV.village?.value,
                        place_id: selectedMapProject?.place_id,
                        full_address: selectedMapProject?.description,
                        pincode: selectedMapProject?.pincode,
                        lng: selectedMapProject?.geometry.location.lng,
                        lat: selectedMapProject?.geometry.location.lat,
                      });
                      submitMapData();
                    }
                  }}
                >
                  Submit Map
                </button>
              </div>
            </div>
            <MapUI />
          </div>
        )}
      </div>
    </div>
  );
}
