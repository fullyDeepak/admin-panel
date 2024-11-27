import { create } from 'zustand';
import { SingleValue } from 'react-select';
import { immer } from 'zustand/middleware/immer';

export interface ErrorFormDataType {
  selectedProject: SingleValue<{
    label: string;
    value: number;
  }> | null;
}

interface State {
  errorFormData: ErrorFormDataType;
}

interface Actions {
  updateErrorFormData: (_newDetails: Partial<ErrorFormDataType>) => void;
}

const INITIAL_PROJECT_DATA_STATE: ErrorFormDataType = {
  selectedProject: null,
};

export const useErrorFormStore = create<State & Actions>()(
  immer((set) => ({
    errorFormData: INITIAL_PROJECT_DATA_STATE,

    updateErrorFormData: (newDetails) =>
      set((prev) => {
        prev.errorFormData = { ...prev.errorFormData, ...newDetails };
      }),
  }))
);
