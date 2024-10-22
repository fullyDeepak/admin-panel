import ReraDropdown from './ReraDropdown';
import { useCorrectionStore } from './useCorrectionStore';
import { useReraCorrectionStore } from '@/store/useReraCorrectionStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import axiosClient from '@/utils/AxiosClient';
import ChipInput from '@/components/ui/Chip';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const inputBoxClass =
  'w-full rounded-md border-0 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 ';
export default function ReraFilterSection() {
  const { updateCorrectionFormData, correctionData } = useCorrectionStore();
  const { selectedProjects } = useReraCorrectionStore();
  const [surveyValue, setSurveyValue] = useState<string[]>([]);
  const [plotValue, setPlotValue] = useState<string[]>([]);
  const queryClient = useQueryClient();
  async function setReraDMVLId(
    type: 'DISTRICT' | 'MANDAL' | 'VILLAGE' | 'SURVEY'
  ) {
    const projectIds = selectedProjects.map((item) => item.value);
    if (
      type === 'DISTRICT' &&
      correctionData.districtIdValue &&
      correctionData.districtIdValue.trim()
    ) {
      console.log('updaing district.........');
      try {
        const response = axiosClient.put('/forms/rera/district', {
          project_ids: projectIds,
          district_id: +correctionData.districtIdValue,
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
        updateCorrectionFormData('districtIdValue', '');
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
    } else if (
      type === 'MANDAL' &&
      correctionData.mandalIdValue &&
      correctionData.mandalIdValue.trim()
    ) {
      try {
        const response = axiosClient.put('/forms/rera/mandal', {
          project_ids: projectIds,
          mandal_id: +correctionData.mandalIdValue,
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
        updateCorrectionFormData('mandalIdValue', '');
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
    } else if (
      type === 'VILLAGE' &&
      correctionData.villageIdValue &&
      correctionData.villageIdValue.trim()
    ) {
      try {
        const response = axiosClient.put('/forms/rera/village', {
          project_ids: projectIds,
          village_id: +correctionData.villageIdValue,
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
        updateCorrectionFormData('villageIdValue', '');
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

  async function setSurveyPlot(type: 'SURVEY' | 'PLOT', value: string[]) {
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

  return (
    <form className='mt-5 flex flex-1 flex-col gap-3 rounded p-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <h3 className='text-center text-2xl font-semibold'>RERA DMVLs</h3>
      <ReraDropdown />
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Assign District ID:</span>
        <div className='flex flex-[5] gap-4'>
          <input
            className={inputBoxClass}
            name='district_id'
            placeholder='Enter ID here'
            type='number'
            value={correctionData.districtIdValue}
            onChange={(e) =>
              updateCorrectionFormData('districtIdValue', e.target.value)
            }
          />
          <button
            className='btn-rezy max-h-10'
            type='button'
            onClick={() => {
              if (
                confirm(
                  `You are updating district id for total ${selectedProjects.length} RERA Projects.\nAre you sure?`
                )
              ) {
                setReraDMVLId('DISTRICT');
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Assign Mandal ID:</span>
        <div className='flex flex-[5] gap-4'>
          <input
            className={inputBoxClass}
            name='mandal_id'
            placeholder='Enter ID here'
            type='number'
            value={correctionData.mandalIdValue}
            onChange={(e) =>
              updateCorrectionFormData('mandalIdValue', e.target.value)
            }
          />
          <button
            className='btn-rezy max-h-10'
            type='button'
            onClick={() => setReraDMVLId('MANDAL')}
          >
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2]'>Assign Village ID:</span>
        <div className='flex flex-[5] gap-4'>
          <input
            className={inputBoxClass}
            name='village_id'
            placeholder='Enter ID here'
            value={correctionData.villageIdValue}
            onChange={(e) =>
              updateCorrectionFormData('villageIdValue', e.target.value)
            }
          />
          <button
            className='btn-rezy max-h-10'
            type='button'
            onClick={() => setReraDMVLId('VILLAGE')}
          >
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Assign Survey:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            updateChipsFn={setSurveyValue}
            chips={surveyValue}
            addTWClass='!ml-0'
          />
          <button
            className='btn-rezy max-h-10'
            disabled={selectedProjects.length === 1 ? false : true}
            type='button'
            onClick={() => {
              setSurveyPlot('SURVEY', surveyValue);
              setSurveyValue([]);
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <span className='flex-[2] text-xl'>Assign Plot:</span>
        <div className='flex flex-[5] gap-4'>
          <ChipInput
            updateChipsFn={setPlotValue}
            chips={plotValue}
            addTWClass='!ml-0'
          />
          <button
            className='btn-rezy max-h-10'
            disabled={selectedProjects.length === 1 ? false : true}
            type='button'
            onClick={() => {
              setSurveyPlot('PLOT', surveyValue);
              setSurveyValue([]);
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-5'>
        <button
          className='btn btn-outline btn-sm max-h-10 w-full border-none bg-violet-500 text-white hover:border-none hover:bg-violet-600'
          type='button'
          onClick={() => {
            queryClient.refetchQueries({
              queryKey: ['rera-district', correctionData.selectedReraDistrict],
            });
            updateCorrectionFormData('selectedReraMandal', null);
            updateCorrectionFormData('selectedReraVillage', null);
            updateCorrectionFormData('selectedReraLocality', null);
          }}
        >
          Refresh All
        </button>
      </div>
    </form>
  );
}
