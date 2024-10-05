import { create } from 'zustand';
import { SingleValue } from 'react-select';

interface OnboardingData {
  district: SingleValue<{
    label: string;
    value: number;
  }>;
  mandal: SingleValue<{
    label: string;
    value: number;
  }>;
  village: SingleValue<{
    label: string;
    value: number;
  }>;
  projectType: SingleValue<{
    label: string;
    value: string;
  }>;
  projectSubType: SingleValue<{
    label: string;
    value: string;
  }>;
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
}
