import { AllGeoJSON } from '@turf/helpers';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ProjectListItem = {
  id: number;
  name: string;
  lng: number;
  lat: number;
  geojson: AllGeoJSON;
  display_project_type: 'APARTMENT' | 'VILLA' | null;
};

type State = {
  currentBoundArea: {
    sw_lng: number;
    sw_lat: number;
    ne_lng: number;
    ne_lat: number;
  };
  projectList: ProjectListItem[];
};

type Actions = {
  setCurrentBoundArea: (_bound: State['currentBoundArea']) => void;
  setProjectList: (_data: State['projectList']) => void;
};

const INITIAL_BOUND_AREA = {
  sw_lng: 78.21192348305861,
  sw_lat: 17.346385140857983,
  ne_lng: 78.4532793790547,
  ne_lat: 17.50951109963415,
};

export const useProjectMapStore = create<State & Actions>()(
  immer((set) => ({
    currentBoundArea: INITIAL_BOUND_AREA,
    projectList: [],
    setCurrentBoundArea: (bound) => set({ currentBoundArea: bound }),
    setProjectList: (data) => set({ projectList: data }),
  }))
);
