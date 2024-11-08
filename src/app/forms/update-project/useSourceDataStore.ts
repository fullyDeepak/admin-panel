import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { OnboardingDataType } from './useOnboardingDataStore';
import { TowerDetailType } from './useTowerUnitStore';
import { FormProjectETLTagDataType } from './useETLDataStore';

export type SourceDataType = {
  projectData: OnboardingDataType | null;
  towerData: TowerDetailType[] | null;
  etlData: FormProjectETLTagDataType[] | null;
};

interface Actions {
  setSourceData: (_data: {
    projectData: OnboardingDataType;
    towerData: TowerDetailType[];
    etlData: FormProjectETLTagDataType[];
  }) => void;
  resetData: () => void;
}

interface Store extends Actions {
  projectData: SourceDataType['projectData'];
  towerData: SourceDataType['towerData'];
  etlData: SourceDataType['etlData'];
}

export const useSourceDataStore = create<Store>()(
  immer((set) => ({
    projectData: null,
    etlData: null,
    towerData: null,
    setSourceData: (data: {
      projectData: OnboardingDataType;
      towerData: TowerDetailType[];
      etlData: FormProjectETLTagDataType[];
    }) =>
      set({
        projectData: data.projectData,
        towerData: data.towerData,
        etlData: data.etlData,
      }),
    resetData: () => set({ projectData: null }),
  }))
);
