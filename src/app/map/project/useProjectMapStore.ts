import { AllGeoJSON } from '@turf/helpers';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ProjectList = {
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
  projectList: ProjectList[];
};

type Actions = {
  setCurrentBoundArea: (_bound: State['currentBoundArea']) => void;
  setProjectList: (_data: State['projectList']) => void;
};

const INITIAL_BOUND_AREA = {
  sw_lng: 78.31913051868275,
  sw_lat: 17.395241363571785,
  ne_lng: 78.33433327937918,
  ne_lat: 17.400759645571647,
};

export const useProjectMapStore = create<State & Actions>()(
  immer((set) => ({
    currentBoundArea: INITIAL_BOUND_AREA,
    projectList: [],
    setCurrentBoundArea: (bound) => set({ currentBoundArea: bound }),
    setProjectList: (data) => set({ projectList: data }),
  }))
);
