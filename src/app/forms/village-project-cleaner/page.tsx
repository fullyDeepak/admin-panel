'use client';

import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import LoadingCircle from '@/components/ui/LoadingCircle';
import MatchAttachMap from './MatchAttachMap';
import { RawAptDataRow, cleanedRowsColumns } from './table-columns';
import { useVillageProjectCleanerStore } from './useVillageProjectCleanerStore';
import DMVDropdown from './DMVDropdown';
import CleanAptData from './CleanAptData';

export default function Page() {
  const { selectedDMV, setDMVOptions } = useVillageProjectCleanerStore();

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
  const [cleanedRows, setCleanedRows] = useState<
    (RawAptDataRow & { clean_apt_name: string; selected_project_id: string })[]
  >([]);

  const [rawAptNames, setRawAptNames] = useState<RawAptDataRow[]>([]);

  const { isLoading } = useQuery({
    queryKey: ['village-project-cleaner'],
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
      setDMVOptions('district', districtOpts);
      return res.data.data;
    },
  });
  const { data: rawAptDictData, isLoading: loadingRawAptDictData } = useQuery({
    queryKey: ['raw-apt-dict', selectedDMV.village],
    queryFn: async () => {
      if (!selectedDMV.village) return null;
      const res = await axiosClient.get<{
        data: RawAptDataRow[];
      }>('/forms/raw-apt-candidates?village_id=' + selectedDMV.village?.value);
      const toSet = res.data.data.map((item) => ({
        ...item,
        raw_apt_name: item.raw_apt_name ? item.raw_apt_name : '[EMPTY]',
        clean_survey: item.clean_survey ? item.clean_survey : '[EMPTY]',
        plots: item.plots ? item.plots : '[EMPTY]',
      }));
      setRawAptNames(toSet);
      return toSet;
    },
  });
  //effects
  useEffect(() => {
    if (selectedDMV.district) {
      const mandalOpts = dmvData
        ?.find((item) => item.district_id === selectedDMV.district?.value)
        ?.mandals.map((item) => ({
          label: `${item.mandal_id}:${item.mandal_name}`,
          value: item.mandal_id,
        }));
      setDMVOptions('mandal', mandalOpts || []);
    }
  }, [selectedDMV.district]);

  useEffect(() => {
    if (selectedDMV.district && selectedDMV.mandal) {
      const villageOpts = dmvData
        ?.find((item) => item.district_id === selectedDMV.district?.value)
        ?.mandals.find((item) => item.mandal_id === selectedDMV.mandal?.value)
        ?.villages.map((item) => ({
          label: `${item.village_id}:${item.village_name}`,
          value: item.village_id,
        }));
      setDMVOptions('village', villageOpts || []);
    }
  }, [selectedDMV.mandal]);

  const updateData = async () => {
    try {
      await axiosClient.post('/forms/update-rawapt-clean', {
        rows: cleanedRows,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const filteredRows = rawAptDictData?.filter((ele) => {
      return !cleanedRows.some(
        (item) =>
          item.raw_apt_name === ele.raw_apt_name &&
          item.clean_survey === ele.clean_survey &&
          item.plot_count === ele.plot_count &&
          item.occurrence_count === ele.occurrence_count
      );
    });
    if (filteredRows) {
      setRawAptNames(filteredRows);
    }
  }, [cleanedRows]);
  return (
    <>
      {isLoading ? (
        <div className='flex h-[50dvh] flex-col items-center justify-center gap-5'>
          <LoadingCircle size='large' />
          <div className='text-3xl font-bold'>Loading DMVs...</div>
        </div>
      ) : (
        <div className='mb-8 mt-10 flex flex-col justify-center'>
          <h1 className='mb-4 text-center text-3xl font-semibold underline'>
            Village Project Cleaner
          </h1>
          <DMVDropdown />
          <MatchAttachMap
            loadingRawAptDictData={loadingRawAptDictData}
            rawAptDictData={rawAptDictData}
            rawAptNames={rawAptNames}
            setCleanedRows={setCleanedRows}
          />
          <CleanAptData
            cleanedRows={cleanedRows}
            cleanedRowsColumns={cleanedRowsColumns}
            setCleanedRows={setCleanedRows}
            updateData={updateData}
          />
        </div>
      )}
    </>
  );
}
