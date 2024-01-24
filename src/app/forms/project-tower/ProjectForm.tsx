import { useQuery } from '@tanstack/react-query';
import { XMLParser } from 'fast-xml-parser';
import Select, { SingleValue } from 'react-select';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import ChipInput from './Chip';
import ETLTagData from './ETLTagData';
import axiosClient from '@/utils/AxiosClient';

const inputBoxClass =
  'w-full flex-[5] ml-[6px] rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 ';

export default function ProjectForm() {
  const { projectFormData, updateProjectFormData } = useProjectStore();
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: number;
  } | null>();
  const [selectedProjectType, setSelectedProjectType] = useState<{
    label: string;
    value: string;
  } | null>();

  const [xmlData, setXmlData] = useState<string | undefined>();
  const [yearArray, setYearArray] = useState(1950);

  // populate village dropdown
  const { isPending: loadingVillages, data: villageOptions } = useQuery({
    queryKey: ['village'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/forms/getOnboardedDMV');
        const data = response.data.data;
        const newData = [];
        for (const district of data) {
          for (const subDistrict of district.districts.districts) {
            for (const mandal of subDistrict.mandals) {
              for (const village of mandal.villages) {
                newData.push({
                  value: village.village_id,
                  label: `${(subDistrict.district_name as string).charAt(0).toUpperCase() + (subDistrict.district_name as string).slice(1).toLowerCase()}-${(mandal.mandal_name as string).charAt(0).toUpperCase() + (mandal.mandal_name as string).slice(1).toLowerCase()}-${(village.village_name as string).charAt(0).toUpperCase() + (village.village_name as string).slice(1).toLowerCase()}`,
                });
              }
            }
          }
        }
        return newData;
      } catch (error) {
        return [];
      }
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
      updateProjectFormData({ towerCoordinates: newCoord });
    }
  }, [xmlData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateProjectFormData({ [name]: value });
  };

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Details</h3>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>DMV:</span>
        <Select
          className='w-full flex-[5]'
          name='village_id'
          key={'village'}
          options={villageOptions || undefined}
          isLoading={loadingVillages}
          required={true}
          value={selectedVillage}
          defaultValue={projectFormData.village_id}
          onChange={(
            e: SingleValue<{
              label: string;
              value: number;
            }>
          ) => {
            setSelectedVillage(e);
            updateProjectFormData({ village_id: e });
          }}
        />
      </label>{' '}
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Name:</span>
        <input
          className={inputBoxClass}
          name='projectName'
          defaultValue={projectFormData.projectName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Layout Name:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='layoutName'
          defaultValue={projectFormData.layoutName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Developer:</span>
        <input
          className={inputBoxClass}
          name='developer'
          defaultValue={projectFormData.developer}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Developer Group:</span>
        <input
          className={inputBoxClass}
          name='developerGroup'
          defaultValue={projectFormData.developerGroup}
          onChange={handleChange}
        />
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
          defaultValue={projectFormData.projectType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            setSelectedProjectType(e);
            if (e?.value === 'residential') {
              updateProjectFormData({
                towerTypeOptions: [
                  { label: 'Apartment', value: 'apartment' },
                  { label: 'Villa', value: 'villa' },
                  { label: 'Mixed', value: 'mixed' },
                ],
              });
              updateProjectFormData({
                projectSubTypeOptions: [
                  { label: 'Gated', value: 'gated' },
                  { label: 'Standalone', value: 'standalone' },
                ],
              });
            } else if (e?.value === 'commercial') {
              updateProjectFormData({
                towerTypeOptions: [
                  { label: 'Office', value: 'Office' },
                  { label: 'Mall', value: 'Mall' },
                  { label: 'Hotel', value: 'Hotel' },
                  { label: 'Other', value: 'Other' },
                ],
              });
              updateProjectFormData({
                projectSubTypeOptions: [
                  { label: 'SEZ Layout', value: 'SEZ Layout' },
                  { label: 'Regular Layout', value: 'Regular Layout' },
                  { label: 'SEZ Standalone', value: 'SEZ Standalone' },
                  { label: 'Regular Standalone', value: 'Regular Standalone' },
                ],
              });
            } else if (e?.value === 'mixed') {
              updateProjectFormData({
                projectSubTypeOptions: undefined,
              });
              updateProjectFormData({
                towerTypeOptions: undefined,
              });
            }
            updateProjectFormData({
              projectType: e,
            });
          }}
          name='projectType'
        />
      </label>
      {/* <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Sub-Type 1:</span>
        <Select
          className='w-full flex-[5]'
          name='projectSubType1'
          options={projectFormData.projectSubType1_Options}
          defaultValue={projectFormData.projectSubType1}
          onChange={(e: SingleValue<{ label: string; value: string }>) =>
            updateProjectFormData({ projectSubType1: e })
          }
        />
      </label> */}
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Sub-Type:</span>
        <Select
          className='w-full flex-[5]'
          name='projectSubType2'
          options={projectFormData.projectSubTypeOptions}
          defaultValue={projectFormData.projectSubType}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => updateProjectFormData({ projectSubType: e })}
        />
      </label>
      {/* show only on edit */}
      {/* <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Overall Status:</span>
        <Select
          className='w-full flex-[5]'
          defaultValue={projectFormData.status}
          options={[
            { label: 'Operational', value: 'operational' },
            { label: 'Under Construction', value: 'under_construction' },
            { label: 'Planned', value: 'planned' },
          ]}
          onChange={(
            e: SingleValue<{
              label: string;
              value: string;
            }>
          ) => {
            updateProjectFormData({ status: e });
          }}
          name='status'
        />
      </label> */}
      {/* only on edit, [overall status===compl] */}
      {/* <div className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Year Completed:</span>
        <YearPicker
          classNames={inputBoxClass}
          year={projectFormData.yearCompleted}
          setYear={updateProjectFormData}
          yearArray={yearArray}
          setYearArray={setYearArray}
          inputName='yearCompleted'
        />
      </div> */}
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Description:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='projectDesc'
          defaultValue={projectFormData.projectDesc}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        {/* should be input chips */}
        <span className='flex-[2] '>Amenities Tags:</span>

        <ChipInput
          chips={projectFormData.amenitiesTags}
          updateFormData={updateProjectFormData}
          updateKey='amenitiesTags'
        />
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
          value={projectFormData.towerCoordinates}
          onChange={(e) =>
            updateProjectFormData({ towerCoordinates: e.target.value })
          }
        />
      </label>
      <ETLTagData />
      {/* only on edit */}
      {/* <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Number of Units:</span>
        <input
          type='number'
          min='0'
          step='any'
          defaultValue={projectFormData.numberOfUnits}
          autoComplete='off'
          className={inputBoxClass}
          name='numberOfUnits'
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Project Size(Built-up):</span>
        <input
          type='number'
          min='0'
          step='any'
          defaultValue={projectFormData.projectSize_builtUp}
          autoComplete='off'
          className={inputBoxClass}
          name='projectSize_builtUp'
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Avg. Floorplate(In sqft.):</span>
        <input
          type='number'
          min='0'
          step='any'
          defaultValue={projectFormData.avgFloorplate}
          autoComplete='off'
          className={inputBoxClass}
          name='avgFloorplate'
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Avg. Floor Height:</span>
        <input
          type='number'
          min='0'
          step='any'
          defaultValue={projectFormData.avgFloorHeight}
          autoComplete='off'
          className={inputBoxClass}
          name='avgFloorHeight'
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Micromarket:</span>
        <input
          className={inputBoxClass}
          name='micromarket'
          defaultValue={projectFormData.micromarket}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5 '>
        <span className='flex-[2] '>Land Area(In acres):</span>
        <input
          type='number'
          min='0'
          step='any'
          defaultValue={projectFormData.landArea}
          autoComplete='off'
          className={inputBoxClass}
          name='landArea'
          onChange={handleChange}
        />
      </label> */}
    </>
  );
}
