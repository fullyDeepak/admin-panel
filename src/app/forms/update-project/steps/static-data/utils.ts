import axiosClient from '@/utils/AxiosClient';
import { SingleValue } from 'react-select';
import useETLDataStore from '../../useETLDataStore';
import { useImageStore } from '../../useImageStore';
import {
  TempProjectSourceData,
  useOnboardingDataStore,
} from '../../useOnboardingDataStore';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import { startCase } from 'lodash';

type Props = {
  e: SingleValue<{ label: string; value: string }>;
  villageOptions: {
    label: string;
    value: number;
  }[];
};

export async function fetchTempProjectDetails({ e, villageOptions }: Props) {
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
      developerGroup: '',
      reraForTempProjects: {},
    });
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
      mainProjectName: startCase(e.label.split(':')[1].trim().toLowerCase()),
      developerMasterId: tempProjectData.data.data.developers?.is_jv
        ? 'JV:' + tempProjectData.data.data.developers?.jv_id?.toString()
        : 'DEVELOPER:' +
          tempProjectData.data.data.developers?.developer_id?.toString(),
      developerGroup:
        tempProjectData.data.data.developers?.developer_group_name,
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
    if (geoData && geoData?.length > 0 && geoData[0]) {
      updateOnboardingData({
        mapData: [
          {
            name: '',
            description: geoData[0]?.full_address || '',
            pincode: geoData[0]?.pin_code?.toString() || '',
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
        village:
          villageOptions.find(
            (ele) => ele.value === onboardingData.selectedVillage?.value
          ) || null,
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
        patterns: [
          {
            pattern: '',
            type: 'tower',
            priority: 1,
          },
          {
            pattern: '',
            type: 'floor',
            priority: 2,
          },
          {
            pattern: '',
            type: 'unit',
            priority: 3,
          },
        ],
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
    resetAllProjectData();
    resetImageStore();
    resetTowerUnitStore();
  }
}
