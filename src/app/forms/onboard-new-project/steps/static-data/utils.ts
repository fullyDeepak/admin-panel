import { SingleValue } from 'react-select';
import {
  TempProjectSourceData,
  useOnboardingDataStore,
} from '../../useOnboardingDataStore';
import { Dispatch, SetStateAction } from 'react';
import axiosClient from '@/utils/AxiosClient';
import useETLDataStore from '../../useETLDataStore';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import { useImageStore } from '../../useImageStore';

type Props = {
  e: SingleValue<{ label: string; value: string }>;
  setReraForTempProjects: Dispatch<
    SetStateAction<{
      [key: string]: string[];
    }>
  >;
  villageOptions: {
    label: string;
    value: number;
  }[];
};

export async function fetchTempProjectDetails({
  e,
  setReraForTempProjects,
  villageOptions,
}: Props) {
  const {
    onboardingData,
    updateOnboardingData,
    addTempProjectSourceData,
    resetData,
  } = useOnboardingDataStore.getState();
  const { setData, resetAllProjectData } = useETLDataStore.getState();
  const { resetTowerUnitStore } = useTowerUnitStore.getState();
  const { resetImageStore } = useImageStore.getState();
  if (e) {
    resetAllProjectData();
    resetTowerUnitStore();
    resetImageStore();
    updateOnboardingData({
      selectedTempProject: e,
      selectedReraProjects: [],
      houseMasterLocalities: [],
      developerMasterId: null,
      coreDoorNumberStrings: [],
    });
    setReraForTempProjects({});
    const tempProjectData = await axiosClient.get<{
      data: TempProjectSourceData;
    }>(`/temp-projects/${e.value}`);
    addTempProjectSourceData(e.value, tempProjectData.data.data);
    const subtype = [
      'Apartment - Gated',
      'Apartment - Standalone',
      'Villa',
      'Mixed Residential',
      'Other',
    ].find(
      (ele) =>
        tempProjectData.data.data.project_subtype.toUpperCase() ===
        ele.toUpperCase()
    );
    updateOnboardingData({
      mainProjectName: e.label.split(':')[1].trim(),
      developerMasterId: tempProjectData.data.data.developers?.is_jv
        ? 'JV:' + tempProjectData.data.data.developers?.jv_id?.toString()
        : 'DEVELOPER:' +
          tempProjectData.data.data.developers?.developer_id?.toString(),
      projectType: [
        {
          label: 'Residential',
          value: 'RESIDENTIAL',
        },
        {
          label: 'Commercial',
          value: 'COMMERCIAL',
        },
        {
          label: 'Mixed',
          value: 'MIXED',
        },
      ].find(
        (ele) =>
          tempProjectData.data.data.project_category.toUpperCase() ===
          ele.value.toUpperCase()
      ),
      projectSubType: subtype
        ? {
            label: subtype,
            value: subtype
              .toUpperCase()
              .replace(' - ', '-')
              .replace(' ', '_')
              .replace('-', '_'),
          }
        : null,
    });
    const geoData = tempProjectData.data.data.geojson_data;
    if (geoData && geoData?.length > 0) {
      updateOnboardingData({
        mapData: [
          {
            name: '',
            description: geoData[0].full_address,
            pincode: geoData[0].pin_code + '',
            place_id: geoData[0].place_id,
            types: '',
            geometry: {
              location: {
                lng: geoData[0].geom_point.coordinates[0],
                lat: geoData[0].geom_point.coordinates[1],
              },
              viewport: {
                northeast: { lat: 0, lng: 0 },
                southwest: { lat: 0, lng: 0 },
              },
            },
          },
        ],
      });
    }
    const plotsToFill = tempProjectData.data.data.keywords
      ?.filter((ele) => ele.keyword_type === 'PLOT_EQUALS' && ele.is_attached)
      .map((ele) => ele.keyword.split('|'))
      .reduce(
        (acc, val) => acc.concat(val.filter((ele) => ele !== 'NULL')),
        []
      );
    setData([
      {
        id: 1,
        village: villageOptions.find(
          (ele) => ele.value === onboardingData.selectedVillage?.value
        ),
        docId: [],
        rootDocs: [],
        apartmentContains: tempProjectData.data.data.raw_apartment_names,
        aptNameNotContains: [],
        aptSurveyPlotDetails: false,
        counterpartyContains: [], // ! couterpartykeywords?
        counterpartySurveyPlotDetails: false,
        docIdNotEquals: [],
        suggestedDoorNumberStartsWith:
          tempProjectData.data.data.municipal_door_numbers?.map((ele) => {
            return `${ele.core_string} : ${ele.unit_numbers.join(', ')} : ${ele.occurrence_count}`;
          }) || [],
        doorNoStartWith: [],
        etlPattern: '',
        localityContains: [],
        localityPlot: [],
        plotContains: [],
        surveyContains: [],
        singleUnit: false,
        wardBlock: [],
        surveyEquals:
          tempProjectData.data.data.keywords
            ?.filter(
              (ele) => ele.keyword_type === 'SURVEY_EQUALS' && ele.is_attached
            )
            .map((ele) => ele.keyword.split('|'))
            .reduce((acc, val) => acc.concat(val), []) || [],
        plotEquals: plotsToFill?.length ? plotsToFill : ['NULL'],
      },
    ]);
  } else {
    // cleanup
    resetData();
    setReraForTempProjects({});
    resetAllProjectData();
    resetImageStore();
    resetTowerUnitStore();
  }
}
