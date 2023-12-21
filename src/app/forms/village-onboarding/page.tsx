'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import axiosClient from '@/utils/AxiosClient';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/primereact.css';
//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import '@/styles/customPrimeReact.css';
import { formatISO } from 'date-fns';

export default function page() {
  const [selectedState, setSelectedState] = useState<{
    label: string;
    value: number;
  } | null>();
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

  const [inputDate, setInputDate] = useState<string | Date>(new Date());
  const [isoDate, setISODate] = useState<string | null>();
  const [replacementDictFlag, setReplacementDictFlag] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    setISODate(formatISO(inputDate as Date));
  }, [inputDate]);

  //   state dropdown
  const {
    isPending: loadingStates,
    error: stateError,
    status: stateCallStatus,
    data: stateOptions,
  } = useQuery({
    queryKey: ['state'],
    queryFn: () => fetchDropdownOption('states'),
    staleTime: Infinity,
  });

  //   set Telangana on first load
  useEffect(() => {
    if ((stateOptions ?? []).length > 0) {
      setSelectedState(stateOptions![27]);
    }
  }, [stateOptions]);

  //   district dropdown
  const {
    isPending: loadingDistricts,
    error: distError,
    status: districtCallStatus,
    data: districtOptions,
  } = useQuery({
    queryKey: ['district', selectedState],
    queryFn: () => {
      if (selectedState !== undefined && selectedState !== null) {
        console.log('fetching districts', selectedState);
        return fetchDropdownOption('districts', 'state', selectedState?.value);
      }
    },
    staleTime: Infinity,
  });

  // mandal dropdown
  const {
    isPending: loadingMandals,
    error: mandalError,
    status: mandalCallStatus,
    data: mandalOptions,
  } = useQuery({
    queryKey: ['mandal', selectedDistrict],
    queryFn: () => {
      if (selectedDistrict !== undefined && selectedDistrict !== null) {
        console.log('fetching mandals', selectedDistrict);
        return fetchDropdownOption(
          'mandals',
          'district',
          selectedDistrict?.value
        );
      }
    },
    staleTime: Infinity,
  });

  const {
    isPending: loadingVillages,
    error: villageError,
    status: villageCallStatus,
    data: villageOptions,
  } = useQuery({
    queryKey: ['village', selectedMandal],
    queryFn: () => {
      if (selectedMandal !== undefined && selectedMandal !== null) {
        console.log('fetching villages', selectedMandal);
        return fetchDropdownOption('villages', 'mandal', selectedMandal?.value);
      }
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    setSelectedVillage(null);
    setReplacementDictFlag(null);
  }, [selectedMandal]);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToastId = toast.loading('Saving...');
    try {
      console.log({
        village_id: selectedVillage?.value,
        onboarding_date: isoDate,
      });
      const res = await axiosClient.post('/forms/onboard_village', {
        village_id: selectedVillage?.value,
        onboarding_date: isoDate,
      });
      toast.success('Database updated.', {
        id: loadingToastId,
        duration: 5000,
      });
    } catch (error: any) {
      toast.error(`${error?.response?.data?.message}`, {
        id: loadingToastId,
        duration: 8000,
      });
    }
  };

  async function checkReplacementStatus(): Promise<void> {
    const checkReplacementToast = toast.loading('Checking status...');
    try {
      const res = await axiosClient.get('/forms/check_replacement_available', {
        params: { village_id: selectedVillage?.value },
      });
      const status: boolean = res?.data?.data;
      if (status) {
        setReplacementDictFlag(true);
        toast.success('In replacement dictionary available.', {
          id: checkReplacementToast,
          duration: 5000,
        });
      } else {
        setReplacementDictFlag(false);
        toast.error('In replacement dictionary not available.', {
          id: checkReplacementToast,
          duration: 5000,
        });
      }
    } catch (error) {
      setReplacementDictFlag(null);
      toast.error('Error occurred while checking status.', {
        id: checkReplacementToast,
        duration: 5000,
      });
    }
  }

  useEffect(() => {
    if (selectedVillage?.value) {
      checkReplacementStatus();
    } else {
      setReplacementDictFlag(null);
    }
  }, [selectedVillage]);

  return (
    <div className='mx-auto mt-10 flex w-[80%] flex-col'>
      <h1 className='self-center text-3xl'>Form: Village Onboarding</h1>
      <Toaster />
      <form
        className='mt-5 flex flex-col gap-3 self-center rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        onSubmit={submitForm}
      >
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>State:</span>
          <Select
            className='w-full flex-[5]'
            key={'state'}
            options={stateOptions}
            isLoading={loadingStates}
            value={selectedState}
            controlShouldRenderValue
            onChange={(e) => {
              setSelectedState(e);
              setSelectedDistrict(null);
            }}
            isDisabled={loadingStates}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>District:</span>
          <Select
            className='w-full flex-[5]'
            key={'district'}
            options={districtOptions || undefined}
            isLoading={loadingDistricts}
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e);
              setSelectedMandal(null);
            }}
            isDisabled={Boolean(!selectedState)}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Mandal:</span>
          <Select
            className='w-full flex-[5]'
            key={'mandal'}
            options={mandalOptions || undefined}
            isLoading={loadingMandals}
            value={selectedMandal}
            onChange={(e) => {
              setSelectedMandal(e);
              setSelectedVillage(null);
            }}
            isDisabled={Boolean(!selectedDistrict)}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>Village:</span>
          <Select
            className='w-full flex-[5]'
            key={'village'}
            options={villageOptions || undefined}
            isLoading={loadingVillages}
            value={selectedMandal ? selectedVillage : null}
            onChange={(e) => setSelectedVillage(e)}
            isDisabled={Boolean(!selectedMandal)}
          />
        </label>
        <label className='flex items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>
            Transactions Onboarding Date:
          </span>
          <Calendar
            // inputId={field.name}
            value={inputDate}
            onChange={(e: CalendarChangeEvent) => {
              setInputDate(e.value as Date);
            }}
            dateFormat='dd/mm/yy'
            className='text-inherit'
          />
        </label>
        {replacementDictFlag !== null && (
          <label className='flex items-center justify-between gap-5 '>
            <span className='flex-[2] text-xl'>In Replacement Dictionary?</span>
            {replacementDictFlag === true ? (
              <span className='badge badge-success badge-lg p-3 font-bold text-white'>
                YES
              </span>
            ) : (
              <span className='badge badge-error badge-lg p-3 font-bold text-white'>
                NO
              </span>
            )}
          </label>
        )}
        <button
          className={`w-full self-center ${
            selectedVillage?.value ? '' : 'btn-disabled'
          } btn btn-info text-white`}
        >
          Update
        </button>
      </form>
    </div>
  );
}
