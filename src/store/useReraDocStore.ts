import axiosClient from '@/utils/AxiosClient';
import { create } from 'zustand';

interface FormState {
  reraDocs: {
    projectId: number;
    fileName: string;
    content: { type: string; data: Uint8Array };
  }[];
  loadingReraDocs: 'idle' | 'loading' | 'complete' | 'error';
  setLoadingReraDocs: (_status: FormState['loadingReraDocs']) => void;
  fetchReraDocs: (_projectIds: number[]) => void;
  resetReraDocs: () => void;
}

interface Response {
  data: FormState['reraDocs'];
}

export const useReraDocStore = create<FormState>((set) => ({
  // Initial state
  reraDocs: [],
  loadingReraDocs: 'idle',
  setLoadingReraDocs: (status) => set({ loadingReraDocs: status }),
  fetchReraDocs: async (projectIds) => {
    set({ loadingReraDocs: 'loading' });
    try {
      const response = await axiosClient.get<Response>(
        '/forms/rera/getReraDocs',
        {
          params: { projectIds: JSON.stringify(projectIds) },
        }
      );
      set({ loadingReraDocs: 'complete' });
      set({ reraDocs: response?.data?.data });
    } catch (error) {
      set({ loadingReraDocs: 'error' });
    }
  },
  resetReraDocs: () => set({ reraDocs: [], loadingReraDocs: 'idle' }),
}));
