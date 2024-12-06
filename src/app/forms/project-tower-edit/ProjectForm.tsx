import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import axiosClient from '@/utils/AxiosClient';
import {
  EditProjectTaggingType,
  useEditProjectStore,
} from './useEditProjectStore';
import { editTowerDetail, useEditTowerStore } from './useEditTowerStore';
import Select, { Option } from 'rc-select';
import CreatableSelect from 'react-select/creatable';
import 'rc-select/assets/index.css';
import { FormProjectETLTagDataType, GetProjectDetails } from '@/types/types';
import ETLTagData from '@/components/forms/ETLTagData';
import { inputBoxClass } from '@/app/constants/tw-class';
import ProjectMatcherSection from '@/components/forms/ProjectMatcherSection';
import { MultiValue } from 'react-select';
import { useId } from 'react';
import { startCase } from 'lodash';

export default function ProjectForm() {
  const {
    editProjectFormData,
    updateEditProjectFormData,
    projectFormETLTagData,
    addProjectETLTagCard,
    updateProjectETLTagData,
    updateOldProjectFormETLTagData,
    deleteProjectETLTagCard,
    resetProjectETLTagCard,
    updateOldProjectFormData,
    updateExistingProjectStatusData,
  } = useEditProjectStore();
  const { setNewTowerEditData, setOldTowerEditData } = useEditTowerStore();

  // populate project dropdown
  useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axiosClient.get('/projects');
        const options = res.data.data.map(
          (item: { id: number; project_name: string }) => ({
            value: item.id,
            label: `${item.id}:${item.project_name}`,
          })
        );
        updateEditProjectFormData({ selectedProjectOption: options });
        return options;
      } catch (error) {
        console.log(error);
      }
    },
  });

  //   populated amenities options
  const { data: amenitiesOptions, isLoading: loadingAmenities } = useQuery({
    queryKey: ['amenitiesOptions'],
    queryFn: async () => {
      const data = await axiosClient.get('/forms/amenities');
      const amenities: { id: number; amenity: string }[] = data.data?.data;
      const amenitiesOptions = amenities.map((item) => ({
        label: item.amenity,
        value: item.id,
      }));
      return amenitiesOptions;
    },
    refetchOnWindowFocus: false,
  });

  // populate village option
  const { data: villageOptions } = useQuery({
    queryKey: ['village'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<{
          data: {
            district_id: number;
            district_name: string;
            mandal_id: number;
            mandal_name: string;
            village_id: number;
            village_name: string;
          }[];
        }>('/forms/getOnboardedDMV');
        const dmvData = response.data.data;
        const newData: { value: number; label: string }[] = [];
        dmvData.map((dmv) => {
          newData.push({
            value: dmv.village_id,
            label: `${startCase(dmv.district_name.toLowerCase())}-${startCase(dmv.mandal_name.toLowerCase())}-${startCase(dmv.village_name.toLowerCase())}`,
          });
        });
        return newData;
      } catch (_error) {
        return [];
      }
    },
    staleTime: Infinity,
  });

  // populate form fields
  async function fetchFormData(selectedProject: number) {
    try {
      const [res, projectStatusData] = await Promise.all([
        axiosClient.get<{ data: GetProjectDetails }>(
          `/projects/${selectedProject}`
        ),
        axiosClient.get<{
          data: {
            id: string;
            updated_at: Date;
            project_id: string;
            tower_id: string;
            updated_field: string;
            updated_value: string;
          }[];
        }>('/projects/status', {
          params: { project_id: selectedProject },
        }),
      ]);
      updateExistingProjectStatusData(projectStatusData.data.data);
      const projectData = res.data.data;
      console.log({ projectData });
      const towerDataRes = projectData.towers;
      const projectETLTagData: FormProjectETLTagDataType[] =
        projectData.ProjectETLTagDataType.map((etlData, index) => {
          const localityWbPlot: {
            locality_contains: string[];
            ward_block: string[];
            locality_plot: string[];
          } =
            etlData.locality_wb_plot.length > 0
              ? JSON.parse(etlData.locality_wb_plot[0])
              : {
                  locality_contains: [],
                  ward_block: [],
                  locality_plot: [],
                };
          return {
            id: index,
            village: {
              label: '' + etlData.village_id,
              value: etlData.village_id,
            },
            docId: etlData.doc_id,
            docIdNotEquals: etlData.doc_id_not_equals,
            rootDocs: etlData.root_docs,
            apartmentContains: etlData.apartment_contains,
            counterpartyContains: etlData.counterparty_contains,
            aptSurveyPlotDetails: etlData.aptSurveyPlotDetails,
            counterpartySurveyPlotDetails:
              etlData.counterpartySurveyPlotDetails,
            localityContains: localityWbPlot.locality_contains,
            wardBlock: localityWbPlot.ward_block,
            localityPlot: localityWbPlot.locality_plot,
            surveyEquals: etlData.survey_equals,
            plotEquals: etlData.plot_equals,
            surveyContains: etlData.survey_contains,
            plotContains: etlData.plot_contains,
            doorNoStartWith: etlData.door_no_start,
            aptNameNotContains: etlData.apt_name_not_contains,
            singleUnit: etlData.single_unit,
            etlPattern: etlData.etl_pattern,
            localityWbPlot: '',
          };
        });
      //reset project etl card before set
      resetProjectETLTagCard();
      // set old project etl data
      updateOldProjectFormETLTagData(projectETLTagData);
      // set project ETL cards
      projectETLTagData.map((etlData, index) =>
        addProjectETLTagCard({ ...etlData, id: index + 1 })
      );
      // map tower data
      const towerData: editTowerDetail[] = towerDataRes.map((item, index) => ({
        id: index + 1,
        towerId: item.tower_id,
        projectPhase: +item.phase,
        reraId: item.rera_id,
        towerType: item.type,
        displayTowerType: item.display_tower_type || '',
        etlTowerName: item.etl_tower_name,
        towerNameAlias: item.tower_name_alias,
        etlUnitConfigs: item.unit_configs.map((unit) => ({
          configName: unit.config,
          minArea: unit.min_built,
          maxArea: unit.max_built,
        })),
        minFloor: item.min_floor,
        maxFloor: item.max_floor,
        groundFloorName: item.ground_floor_name,
        deleteFullUnitNos: item.delete_full_unit_nos,
        exceptionUnitNos: item.exception_unit_nos,
        groundFloorUnitNoMax: item.ground_floor_unit_no_max,
        groundFloorUnitNoMin: item.ground_floor_unit_no_min,
        typicalFloorUnitNoMax: item.typical_floor_unit_no_max,
        typicalFloorUnitNoMin: item.typical_floor_unit_no_min,
        towerDoorNo: item.tower_door_no,
        validTowerUnits: null,
      }));
      console.log({ towerData });
      setNewTowerEditData(towerData);
      setOldTowerEditData(towerData);
      const amenities = projectData.amenities.map(
        (item: { id: number; amenity: string }) => ({
          label: item.amenity,
          value: item.id,
        })
      );

      const localities: {
        label: string;
        value: string;
      }[] = JSON.parse(projectData?.localities || '[]')?.map(
        (locality: string) => ({
          label: locality,
          value: locality,
        })
      );
      const projectFormData: Partial<EditProjectTaggingType> = {
        village_id: projectData.village_id,
        projectName: projectData.project_name,
        developerGroup: projectData.developer_group_name,
        developer: projectData.developer_name,
        layoutName: projectData.project_layout,
        projectDesc: projectData.project_description,
        projectType: projectData.project_category,
        displayProjectType: projectData.display_project_type,
        projectSubType: projectData.project_subtype,
        amenitiesTags: amenities,
        localities: localities || [],
        reraId: projectData.rera_id,
        developerKeywords: projectData.developer_keywords || [],
        landlordKeywords: projectData.landlord_keywords || [],
        selectedProjectStatusTowers: towerData.map((tower) => ({
          label: `${tower.id}:${tower.etlTowerName}`,
          value: tower.id,
        })),
      };
      updateEditProjectFormData(projectFormData);
      updateOldProjectFormData(projectFormData);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateEditProjectFormData({ [name]: value });
  };

  useEffect(() => {
    if (editProjectFormData.projectType === 'residential') {
      updateEditProjectFormData({
        towerTypeOptions: [
          { label: 'Apartment', value: 'apartment' },
          { label: 'Apartment - Single', value: 'apartmentSingle' },
          { label: 'Villa', value: 'villa' },
          { label: 'Mixed', value: 'mixed' },
        ],
      });
      updateEditProjectFormData({
        projectSubTypeOptions: [
          { label: 'Gated', value: 'gated' },
          { label: 'Standalone', value: 'standalone' },
        ],
      });
    } else if (editProjectFormData.projectType === 'commercial') {
      updateEditProjectFormData({
        towerTypeOptions: [
          { label: 'Office', value: 'Office' },
          { label: 'Mall', value: 'Mall' },
          { label: 'Hotel', value: 'Hotel' },
          { label: 'Other', value: 'Other' },
        ],
      });
      updateEditProjectFormData({
        projectSubTypeOptions: [
          { label: 'SEZ Layout', value: 'SEZ Layout' },
          { label: 'Regular Layout', value: 'Regular Layout' },
          { label: 'SEZ Standalone', value: 'SEZ Standalone' },
          {
            label: 'Regular Standalone',
            value: 'Regular Standalone',
          },
        ],
      });
    } else if (editProjectFormData.projectType === 'mixed') {
      updateEditProjectFormData({
        projectSubTypeOptions: undefined,
      });
      updateEditProjectFormData({
        towerTypeOptions: undefined,
      });
    }
  }, [editProjectFormData.projectType]);

  return (
    <>
      <h3 className='my-4 text-2xl font-semibold'>Section: Project Details</h3>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Select Project to Edit:</span>
        <span className='flex w-full flex-[5] items-center gap-5'>
          <Select
            showSearch
            animation='slide-up'
            optionFilterProp='desc'
            value={editProjectFormData.selectedProject}
            onChange={(e) => {
              updateEditProjectFormData({ selectedProject: e });
              fetchFormData(e);
            }}
            placeholder='Select Project Id and Name'
            className='rounded-full'
          >
            {editProjectFormData.selectedProjectOption.map((item, i) => (
              <Option
                key={i}
                value={item.value}
                className='cursor-pointer'
                desc={item.label}
              >
                {item.label}
              </Option>
            ))}
          </Select>
          {editProjectFormData.projectName && (
            <button
              type='button'
              className='btn btn-error btn-xs rounded-full text-white'
              onClick={() =>
                (
                  document.getElementById(
                    'project-delete-modal'
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              Delete
            </button>
          )}
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Name:</span>
        <input
          className={inputBoxClass}
          name='projectName'
          value={editProjectFormData.projectName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Layout Name:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='layoutName'
          value={editProjectFormData.layoutName}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Developer:</span>
        <input
          className={inputBoxClass}
          name='developer'
          value={editProjectFormData.developer}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Developer Group:</span>
        <input
          className={inputBoxClass}
          name='developerGroup'
          value={editProjectFormData.developerGroup}
          onChange={handleChange}
        />
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Type:</span>
        <span className='w-full flex-[5] pl-2'>
          <Select
            value={editProjectFormData.projectType}
            onChange={(e) => {
              updateEditProjectFormData({ projectType: e });
            }}
          >
            {[
              { label: 'Residential', value: 'residential' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Mixed', value: 'mixed' },
            ].map((option, index) => (
              <Option
                key={index}
                value={option.value}
                className='cursor-pointer'
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Sub Type:</span>
        <span className='w-full flex-[5] pl-2'>
          <Select
            onChange={(e) => updateEditProjectFormData({ projectSubType: e })}
            value={editProjectFormData.projectSubType}
            className='w-full'
          >
            {editProjectFormData.projectSubTypeOptions.map((option, index) => (
              <Option
                key={index}
                value={option.value}
                className='cursor-pointer'
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Display Project Type:</span>
        <span className='w-full flex-[5] pl-2'>
          <Select
            onChange={(e) =>
              updateEditProjectFormData({ displayProjectType: e })
            }
            value={editProjectFormData.displayProjectType}
            className='w-full'
          >
            <Option key={1} value={'APARTMENT'} className='cursor-pointer'>
              APARTMENT
            </Option>
            <Option key={2} value={'VILLA'} className='cursor-pointer'>
              VILLA
            </Option>
          </Select>
        </span>
      </label>
      <label className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Project Description:</span>
        <input
          type='text'
          className={inputBoxClass}
          name='projectDesc'
          value={editProjectFormData.projectDesc}
          onChange={handleChange}
        />
      </label>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Amenities Tags:</span>
        <CreatableSelect
          className='w-full flex-[5]'
          options={amenitiesOptions || []}
          isLoading={loadingAmenities}
          value={editProjectFormData.amenitiesTags}
          isClearable
          isMulti
          instanceId={useId()}
          onChange={(
            e: MultiValue<{
              label: string;
              value: string | number;
              __isNew__?: boolean | undefined;
            }>
          ) => {
            updateEditProjectFormData({
              amenitiesTags: e,
            });
          }}
        />
      </div>
      {projectFormETLTagData && projectFormETLTagData.length > 0 && (
        <>
          <ETLTagData
            addProjectETLCard={addProjectETLTagCard}
            deleteProjectETLCard={deleteProjectETLTagCard}
            formProjectETLTagData={projectFormETLTagData}
            updateProjectETLFormData={updateProjectETLTagData}
            villageOptions={villageOptions}
            isUpdateForm={true}
          />
          <ProjectMatcherSection
            formData={editProjectFormData}
            updateFormData={updateEditProjectFormData}
          />
        </>
      )}
    </>
  );
}
