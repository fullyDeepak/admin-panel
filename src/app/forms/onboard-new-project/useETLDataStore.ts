import { create } from 'zustand';
export interface FormProjectETLTagDataType {
  id: number;
  village:
    | {
        label: string;
        value: number;
      }
    | undefined;
  docId: string[];
  docIdNotEquals: string[];
  rootDocs: string[];
  apartmentContains: string[];
  counterpartyContains: string[];
  aptSurveyPlotDetails: boolean;
  suggestedDoorNumberStartsWith: string[];
  counterpartySurveyPlotDetails: boolean;
  localityContains: string[];
  wardBlock: string[];
  localityPlot: string[];
  surveyEquals: string[];
  plotEquals: string[];
  surveyContains: string[];
  plotContains: string[];
  doorNoStartWith: string[];
  aptNameNotContains: string[];
  singleUnit: boolean;
  etlPattern: string;
}
interface FormState {
  projectFormETLTagData: FormProjectETLTagDataType[];
  updateProjectETLTagData: <T extends keyof FormProjectETLTagDataType>(
    _etlCardId: number,
    _key: T,
    _value: FormProjectETLTagDataType[T]
  ) => void;
  addProjectETLTagCard: (_newDetails: FormProjectETLTagDataType) => void;
  addNewProjectETLTagCard: (_newDetails: { id: number }) => void;
  deleteProjectETLTagCard: (_etlCardId: number) => void;
  resetAllProjectData: () => void;
  setData: (_data: FormProjectETLTagDataType[]) => void;
}

export const INITIAL_DATA = {
  village: undefined,
  surveyEquals: [],
  docId: [],
  rootDocs: [],
  apartmentContains: [],
  counterpartyContains: [],
  aptSurveyPlotDetails: false,
  counterpartySurveyPlotDetails: false,
  plotEquals: [],
  surveyContains: [],
  plotContains: [],
  doorNoStartWith: [],
  aptNameNotContains: [],
  docIdNotEquals: [],
  singleUnit: false,
  etlPattern: '',
  localityContains: [],
  localityPlot: [],
  wardBlock: [],
  suggestedDoorNumberStartsWith: [],
};
const initialStateProjectETLTagData: FormProjectETLTagDataType[] = [
  {
    id: 1,
    ...INITIAL_DATA,
  },
];

export default create<FormState>((set) => ({
  // Initial state
  projectFormETLTagData: initialStateProjectETLTagData,

  // Update functions
  updateProjectETLTagData: (etlCardId, key, value) => {
    set((state) => ({
      projectFormETLTagData: state.projectFormETLTagData.map((data) =>
        data.id === etlCardId ? { ...data, [key]: value } : data
      ),
    }));
  },
  addProjectETLTagCard: (newDetails) =>
    set((state) => ({
      projectFormETLTagData: [
        ...state.projectFormETLTagData,
        { ...newDetails },
      ],
    })),
  deleteProjectETLTagCard: (etlCardId) =>
    set((state) => ({
      projectFormETLTagData: state.projectFormETLTagData.filter(
        (item) => item.id !== etlCardId
      ),
    })),
  resetAllProjectData: () => {
    set({
      projectFormETLTagData: initialStateProjectETLTagData,
    });
  },
  setData: (data) => set({ projectFormETLTagData: data }),
  addNewProjectETLTagCard: (newDetails) =>
    set((state) => ({
      projectFormETLTagData: [
        ...state.projectFormETLTagData,
        { ...newDetails, ...INITIAL_DATA },
      ],
    })),
}));
