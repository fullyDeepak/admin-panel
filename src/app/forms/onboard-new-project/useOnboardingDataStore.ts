import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';

export interface OnboardingDataType {
  district: SingleValue<{
    label: string;
    value: number;
  }> | null;
  mandal: SingleValue<{
    label: string;
    value: number;
  }> | null;
  village: SingleValue<{
    label: string;
    value: number;
  }> | null;
  projectType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  projectSubType: SingleValue<{
    label: string;
    value: string;
  }> | null;
  projectSourceType: 'RERA' | 'TEMP' | 'HYBRID';
  selectedProjects: {
    label: string;
    value: string;
  }[];
  selectedReraProjects: {
    label: string;
    value: string;
  }[];
  mainProjectName: string;
  layoutTags: string[];
  geocodedAddress: string;
  colonyTags: string[];
  mapLayers: string[];
  isLuxuryProject: boolean;
  HouseMasterLocalities: string[];
  core_door_number_string: string;
  keywordType: {
    label: string;
    value: string;
  } | null;
  landlordKeywords: string[];
  developerKeywords: string[];
}

interface Actions {
  updateOnboardingData: (_newDetails: Partial<OnboardingDataType>) => void;
}

interface Store extends Actions {
  onboardingData: OnboardingDataType;
}

const INITIAL_STATE: OnboardingDataType = {
  district: null,
  mandal: null,
  village: null,
  projectType: null,
  projectSubType: null,
  projectSourceType: 'RERA',
  selectedProjects: [],
  selectedReraProjects: [],
  mainProjectName: '',
  layoutTags: [],
  geocodedAddress: '',
  colonyTags: [],
  mapLayers: [],
  isLuxuryProject: false,
  HouseMasterLocalities: [],
  core_door_number_string: '',
  keywordType: null,
  landlordKeywords: [],
  developerKeywords: [],
};

export const useOnboardingDataStore = create<Store>()(
  immer((set) => ({
    onboardingData: INITIAL_STATE,
    updateOnboardingData: (newDetails) =>
      set(
        (prev) =>
          (prev.onboardingData = { ...prev.onboardingData, ...newDetails })
      ),
  }))
);
