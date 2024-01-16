'use client';

import axiosClient from '@/utils/AxiosClient';
import { fetchDropdownOption } from '@/utils/fetchDropdownOption';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select, { SingleValue } from 'react-select';
const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';

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
  const [selectedProjectType, setSelectedProjectType] = useState<{
    label: string;
    value: string;
  } | null>();
  const [projectSubTypeOptions, setProjectSubTypeOptions] = useState<
    { label: string; value: string }[] | undefined
  >();
  const [projectSubTypeTwoOptions, setProjectSubTypeTwoOptions] = useState<
    { label: string; value: string }[] | undefined
  >();
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [xmlData, setXmlData] = useState<string | undefined>();
  const [coordinates, setCoordinates] = useState<string | undefined>();
  let loadingToastId: string;

  // populate state dropdown
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

  // populate district dropdown
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
      return [];
    },
    staleTime: Infinity,
  });

  // populate mandal dropdown
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
      return [];
    },
    staleTime: Infinity,
  });

  // populate village dropdown
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
      return [];
    },
    staleTime: Infinity,
  });

  const extractKMLCoordinates = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    if (e.target && e.target.files && e.target.files[0]) {
      reader.onload = async (e) => {
        if (e.target) {
          const text = e.target.result as string;
          setXmlData(text);
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  function findValueByKey(
    obj: { [key: string]: any },
    targetKey: string
  ): string | undefined {
    for (const key in obj) {
      if (key === targetKey) {
        return obj[key];
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const result = findValueByKey(obj[key], targetKey);
        if (result !== undefined) {
          return result;
        }
      }
    }
    return undefined;
  }

  useEffect(() => {
    if (xmlData) {
      const parser = new XMLParser();
      const xmlObj = parser.parse(xmlData);
      const cord = findValueByKey(xmlObj, 'coordinates');
      const newCoord = cord?.replaceAll(',0 ', ',').replaceAll(',0', '');
      setCoordinates(newCoord);
    }
  }, [xmlData]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    toast.loading(`Saving to database.`, {
      id: loadingToastId,
    });
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.delete('kmlFile');
    const data: { [key: string]: any } = {};
    try {
      for (const [key, value] of formData.entries()) {
        if (key === 'yearCompleted' && value) {
          data[key] = (value as string).split('-')[0];
        } else if (
          key !== 'state_id' &&
          key !== 'district_id' &&
          key !== 'mandal_id'
        ) {
          data[key] = value;
        }
      }
      console.log(data);
      if (!data.village_id) {
        throw new Error('Village_id missing');
      }
      const response = await axiosClient.post(
        '/forms/projecttowertagging',
        data
      );
      toast.dismiss(loadingToastId);
      toast.success(`Data Saved to database.`, {
        id: loadingToastId,
        duration: 3000,
      });
      setResponseData(response.data);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(`Something went wrong!!!`, {
        id: loadingToastId,
        duration: 3000,
      });
      if (axios.isAxiosError(error)) {
        setResponseData(error.response?.data as {});
      } else {
        setResponseData(error as {});
      }
    }
  };

  return (
    <div className='mx-auto mt-10 flex w-full flex-col md:w-[80%]'>
      <Toaster />
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Tower Tagging
      </h1>
      <form
        className='mt-5 flex w-full max-w-full  flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerForm'
        onSubmit={submitForm}
      >
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>State:</span>
          <Select
            className='w-full flex-[5]'
            name='state_id'
            key={'state'}
            options={stateOptions}
            isLoading={loadingStates}
            value={selectedState}
            controlShouldRenderValue
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedState(e);
              setSelectedDistrict(null);
            }}
            isDisabled={loadingStates}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>District:</span>
          <Select
            className='w-full flex-[5]'
            name='district_id'
            key={'district'}
            options={districtOptions || undefined}
            isLoading={loadingDistricts}
            value={selectedDistrict}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedDistrict(e);
              setSelectedMandal(null);
            }}
            isDisabled={Boolean(!selectedState)}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Mandal:</span>
          <Select
            className='w-full flex-[5]'
            name='mandal_id'
            key={'mandal'}
            options={mandalOptions || undefined}
            isLoading={loadingMandals}
            value={selectedMandal}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => {
              setSelectedMandal(e);
              setSelectedVillage(null);
            }}
            isDisabled={Boolean(!selectedDistrict)}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Village:</span>
          <Select
            className='w-full flex-[5]'
            name='village_id'
            key={'village'}
            options={villageOptions || undefined}
            isLoading={loadingVillages}
            required={true}
            value={selectedMandal ? selectedVillage : null}
            onChange={(
              e: SingleValue<{
                label: string;
                value: number;
              }>
            ) => setSelectedVillage(e)}
            isDisabled={Boolean(!selectedMandal)}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Apartment Name:</span>
          <input className={inputBoxClass} name='apartmentName' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Layout Name:</span>
          <input type='text' className={inputBoxClass} name='layoutName' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Rera ID:</span>
          <input className={inputBoxClass} name='reraId' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Developer:</span>
          <input className={inputBoxClass} name='developer' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Developer Group:</span>
          <input className={inputBoxClass} name='developerGroup' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Type:</span>
          <Select
            className='w-full flex-[5]'
            options={[
              { label: 'Residential', value: 'residential' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Mixed', value: 'mixed' },
            ]}
            value={selectedProjectType}
            onChange={(
              e: SingleValue<{
                label: string;
                value: string;
              }>
            ) => {
              setSelectedProjectType(e);
              if (e?.value === 'residential') {
                setProjectSubTypeOptions([
                  { label: 'Apartment', value: 'apartment' },
                  { label: 'Villa', value: 'villa' },
                  { label: 'Mixed', value: 'mixed' },
                ]);
                setProjectSubTypeTwoOptions([
                  { label: 'Gated', value: 'gated' },
                  { label: 'Standalone', value: 'standalone' },
                ]);
              } else if (e?.value === 'commercial') {
                setProjectSubTypeOptions([
                  { label: 'Office', value: 'Office' },
                  { label: 'Mall', value: 'Mall' },
                  { label: 'Hotel', value: 'Hotel' },
                  { label: 'Other', value: 'Other' },
                ]);
                setProjectSubTypeTwoOptions([
                  { label: 'SEZ Layout', value: 'SEZ Layout' },
                  { label: 'Regular Layout', value: 'Regular Layout' },
                  { label: 'SEZ Standalone', value: 'SEZ Standalone' },
                  { label: 'Regular Standalone', value: 'Regular Standalone' },
                ]);
              } else if (e?.value === 'mixed') {
                setProjectSubTypeOptions(undefined);
                setProjectSubTypeTwoOptions(undefined);
              }
            }}
            name='projectType'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Sub-Type:</span>
          <Select
            className='w-full flex-[5]'
            name='projectSubType1'
            options={projectSubTypeOptions}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Sub-Type 2:</span>
          <Select
            className='w-full flex-[5]'
            name='projectSubType2'
            options={projectSubTypeTwoOptions}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Status:</span>
          <Select
            className='w-full flex-[5]'
            options={[
              { label: 'Operational', value: 'operational' },
              { label: 'Under Construction', value: 'under_construction' },
              { label: 'Planned', value: 'planned' },
            ]}
            name='status'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2]'>Pre RERA:</span>
          <span className='flex flex-[5] items-center justify-between gap-5'>
            <span
              className={`badge badge-lg font-bold text-white ${
                switchValue ? 'badge-success' : 'badge-error'
              }`}
            >
              Switch is {switchValue ? 'ON' : 'OFF'}
            </span>
            <input
              type='checkbox'
              name='preRera'
              id=''
              className='toggle toggle-success'
              checked={switchValue}
              onChange={() => setSwitchValue(!switchValue)}
            />
          </span>
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Brief:</span>
          <input type='text' className={inputBoxClass} name='projectBrief' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Number of Units:</span>
          <input
            type='number'
            min='0'
            step='any'
            defaultValue={0}
            autoComplete='off'
            className={inputBoxClass}
            name='numberOfUnits'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Project Size(Built-up):</span>
          <input
            type='number'
            min='0'
            step='any'
            defaultValue={0}
            autoComplete='off'
            className={inputBoxClass}
            name='projectSize_builtUp'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Avg. Floorplate(In sqft.):</span>
          <input
            type='number'
            min='0'
            step='any'
            defaultValue={0}
            autoComplete='off'
            className={inputBoxClass}
            name='avgFloorplate'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Avg. Floor Height:</span>
          <input
            type='number'
            min='0'
            step='any'
            defaultValue={0}
            autoComplete='off'
            className={inputBoxClass}
            name='avgFloorHeight'
          />
        </label>
        {/* <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Layout Plan:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
            name='layoutPlanFile'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Tower Plan:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
            name='towerPlane'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Floor Plan:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
            name='floorPlan'
          />
        </label> */}
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Year Completed:</span>
          <input
            type='month'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
            name='yearCompleted'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Micromarket:</span>
          <input className={inputBoxClass} name='micromarket' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Land Area(In acres):</span>
          <input
            type='number'
            min='0'
            step='any'
            defaultValue={0}
            autoComplete='off'
            className={inputBoxClass}
            name='landArea'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Amenities Tags:</span>
          <input className={inputBoxClass} name='amenitiesTags' />
        </label>
        {/* <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Specification:</span>
          <input
            type='file'
            className='file-input file-input-bordered file-input-md w-full flex-[5]'
            name='specification'
          />
        </label> */}
        {/* <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] text-xl'>New in db:</span>
          <span className='flex flex-[5] items-center justify-between gap-5'>
            <span
              className={`badge badge-lg font-bold text-white ${
                switchValue ? 'badge-success' : 'badge-error'
              }`}
            >
              Switch is {switchValue ? 'ON' : 'OFF'}
            </span>
            <input
              type='checkbox'
              name=''
              id=''
              className='toggle toggle-success'
              checked={switchValue}
              onChange={() => setSwitchValue(!switchValue)}
            />
          </span>
        </label> */}
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Survey Equals:</span>
          <input type='text' className={inputBoxClass} name='surveyEqual' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Survey Contains:</span>
          <input type='text' className={inputBoxClass} name='surveyContains' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Plot Equals:</span>
          <input type='text' className={inputBoxClass} name='plotEqual' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Apartment Contains:</span>
          <input
            type='text'
            className={inputBoxClass}
            name='apartmentContains'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Counterparty Contains:</span>
          <input
            type='text'
            className={inputBoxClass}
            name='counterpartyContains'
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Towers:</span>
          <input type='text' className={inputBoxClass} name='towers' />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Upload KML File:</span>
          <input
            type='file'
            name='kmlFile'
            accept='.kml'
            className='file-input input-bordered w-full flex-[5]'
            onChange={(e) => extractKMLCoordinates(e)}
          />
        </label>
        <label className='flex flex-wrap items-center justify-between gap-5 '>
          <span className='flex-[2] '>Towers Coordinates:</span>
          <input
            type='text'
            className={inputBoxClass}
            name='towerCoordinates'
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
          />
        </label>
        <p className='text-xl font-semibold'>Tower Configuration:</p>
        <div className='flex flex-col gap-5'>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2]'></span>
            <div className='flex min-w-min items-center justify-center gap-5'>
              <span>Min Area (sft)</span>
              <span>Max Area (sft)</span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>Studio</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='studioMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='studioMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>1 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='oneBhkMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='oneBhkMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>1.5 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='onePtFiveBhkMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='onePtFiveBhkMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>2 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='twoBhkMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='twoBhkMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>2.5 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='twoPtFiveBhmMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='twoPtFiveBhmMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>3 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='threeBhkMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='threeBhkMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>3.5 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='threePtFiveBhkMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='threePtFiveBhkMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>4 BHK</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='fourBhkMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='fourBhkMax'
              />
            </div>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <span className='flex-[2] '>5 BHK and above</span>
            <div className='flex min-w-min gap-5'>
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className=' w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='fiveBhkPlusMin'
              />
              <input
                type='number'
                min='0'
                step='any'
                defaultValue={0}
                autoComplete='off'
                className='w-28 rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 '
                name='fiveBhkPlusMax'
              />
            </div>
          </div>
        </div>
        <button className='btn btn-info w-full self-center text-white'>
          Update
        </button>
      </form>
      {responseData && (
        <p className='my-10 text-center text-xl'>
          {JSON.stringify(responseData)}
        </p>
      )}
      <div className='mt-40'></div>
    </div>
  );
}
