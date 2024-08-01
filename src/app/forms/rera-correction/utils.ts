import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import {
  useCorrectionStore,
  useCorrectionStoreState,
} from './useCorrectionStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import axiosClient from '@/utils/AxiosClient';

const { setFormData } = useCorrectionStore.getState();
const { districtIdValue, mandalIdValue, villageIdValue } =
  useCorrectionStoreState();
const { selectedProjects } = useReraCorrectionStore.getState();

export async function setReraDMVLId(
  type: 'DISTRICT' | 'MANDAL' | 'VILLAGE' | 'SURVEY'
) {
  const projectIds = selectedProjects.map((item) => item.value);
  if (type === 'DISTRICT' && districtIdValue && districtIdValue.trim()) {
    try {
      const response = axiosClient.put('/forms/rera/district', {
        project_ids: projectIds,
        district_id: +districtIdValue,
      });
      await toast.promise(
        response,
        {
          loading: `Saving district id to database.`,
          success: 'District ID updated',
          error: `Couldn't save district id.`,
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
      setFormData('districtIdValue', '');
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status &&
        error.response?.status >= 400
      ) {
        const errMsg =
          error.response.data?.message || error.response.data?.error;
        toast.error(`Error: ${errMsg}`, {
          duration: 3000,
        });
      } else {
        toast.error("Couldn't send data to server.", {
          duration: 3000,
        });
      }
    }
  } else if (type === 'MANDAL' && mandalIdValue && mandalIdValue.trim()) {
    try {
      const response = axiosClient.put('/forms/rera/mandal', {
        project_ids: projectIds,
        mandal_id: +mandalIdValue,
      });
      await toast.promise(
        response,
        {
          loading: `Saving mandal id to database.`,
          success: 'Mandal ID updated',
          error: `Couldn't save mandal id.`,
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
      setFormData('mandalIdValue', '');
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status &&
        error.response?.status >= 400
      ) {
        const errMsg =
          error.response.data?.message || error.response.data?.error;
        toast.error(`Error: ${errMsg}`, {
          duration: 3000,
        });
      } else {
        toast.error("Couldn't send data to server.", {
          duration: 3000,
        });
      }
    }
  } else if (type === 'VILLAGE' && villageIdValue && villageIdValue.trim()) {
    try {
      const response = axiosClient.put('/forms/rera/village', {
        project_ids: projectIds,
        village_id: +villageIdValue,
      });
      await toast.promise(
        response,
        {
          loading: `Saving village id to database.`,
          success: 'Village ID updated',
          error: `Couldn't save village id.`,
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
      setFormData('villageIdValue', '');
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status &&
        error.response?.status >= 400
      ) {
        const errMsg =
          error.response.data?.message || error.response.data?.error;
        toast.error(`Error: ${errMsg}`, {
          duration: 3000,
        });
      } else {
        toast.error("Couldn't send data to server.", {
          duration: 3000,
        });
      }
    }
  }
}

export async function setSurveyPlot(type: 'SURVEY' | 'PLOT', value: string[]) {
  if (selectedProjects.length === 1) {
    const projectId = selectedProjects[0].value;
    if (type === 'SURVEY' && value && value.length > 0) {
      try {
        const response = axiosClient.put('/forms/rera/survey', {
          project_id: projectId,
          surveys: value,
        });
        await toast.promise(
          response,
          {
            loading: `Saving surveys id to database.`,
            success: 'Surveys cleaned ✨',
            error: `CCouldn't save survey to DB.`,
          },
          {
            success: {
              duration: 10000,
            },
          }
        );
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response?.status >= 400
        ) {
          const errMsg =
            error.response.data?.message || error.response.data?.error;
          toast.error(`Error: ${errMsg}`, {
            duration: 3000,
          });
        } else {
          toast.error("Couldn't send data to server.", {
            duration: 3000,
          });
        }
      }
    } else if (type === 'PLOT' && value && value.length > 0) {
      try {
        const response = axiosClient.put('/forms/rera/plot', {
          project_id: projectId,
          plots: value,
        });
        await toast.promise(
          response,
          {
            loading: `Saving plots id to database.`,
            success: 'Plots cleaned ✨',
            error: `CCouldn't save plots to DB.`,
          },
          {
            success: {
              duration: 10000,
            },
          }
        );
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          error.response?.status >= 400
        ) {
          const errMsg =
            error.response.data?.message || error.response.data?.error;
          toast.error(`Error: ${errMsg}`, {
            duration: 3000,
          });
        } else {
          toast.error("Couldn't send data to server.", {
            duration: 3000,
          });
        }
      }
    }
  }
}

export const sroTableColumns = [
  {
    header: 'District ID',
    accessorKey: 'district_id',
  },
  {
    header: 'District Name',
    accessorKey: 'district_name',
  },
  {
    header: 'Mandal ID',
    accessorKey: 'mandal_id',
  },
  {
    header: 'Mandal Name',
    accessorKey: 'mandal_name',
  },
  {
    header: 'Village ID',
    accessorKey: 'village_id',
  },
  {
    header: 'Village Name',
    accessorKey: 'village_name',
  },
];
