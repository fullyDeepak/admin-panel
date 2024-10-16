import { SingleValue } from 'react-select';
import {
  TempProjectSourceData,
  useOnboardingDataStore,
} from '../../useOnboardingDataStore';
import { Dispatch, SetStateAction } from 'react';
import axiosClient from '@/utils/AxiosClient';
import useETLDataStore from '../../useETLDataStore';

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
  const { onboardingData, updateOnboardingData, addTempProjectSourceData } =
    useOnboardingDataStore.getState();
  const { setData } = useETLDataStore.getState();
  if (e) {
    updateOnboardingData({
      selectedTempProject: e,
      selectedReraProjects: [],
    });
    setReraForTempProjects({});
    const tempProjectData = await axiosClient.get<{
      data: TempProjectSourceData;
    }>(`/temp-projects/${e.value}`);
    addTempProjectSourceData(e.value, tempProjectData.data.data);
    if (!onboardingData.mainProjectName) {
      updateOnboardingData({
        mainProjectName: e.label.split(':')[1].trim(),
      });
      setData([
        {
          id: 1,
          village: villageOptions.find(
            (ele) => ele.value === onboardingData.selectedVillage?.value
          ),
          docId: [],
          rootDocs:
            tempProjectData.data.data.root_docs?.map((item) => item.doc_id) ||
            [],
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
          plotEquals:
            tempProjectData.data.data.keywords
              ?.filter(
                (ele) => ele.keyword_type === 'PLOT_EQUALS' && ele.is_attached
              )
              .map((ele) => ele.keyword.split('|'))
              .reduce((acc, val) => acc.concat(val), []) || [],
        },
      ]);
    }
  } else {
    // cleanup
    updateOnboardingData({
      selectedReraProjects: [],
      selectedTempProject: null,
    });
    setReraForTempProjects({});
  }
}
