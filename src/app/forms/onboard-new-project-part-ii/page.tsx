'use client';

import { cn } from '@/lib/utils';
import StepsUI from './StepsUI';
import ProjectContainer from './steps/project/ProjectContainer';
import TowerContainer from './steps/tower/TowerContainer';
import { useProjectDataStore } from './useProjectDataStore';
import { useTowerUnitStore } from './useTowerUnitStore';
import PreviewContainer from './steps/preview/PreviewContainer';
import { UnitCardDataToPost } from './types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '@/utils/AxiosClient';
import ImageFormContainer from './steps/image/ImageFormContainer';
import StatusContainer from './steps/status-pricing/StatusContainer';

export default function Page() {
  const {
    formStepsList,
    setFormSteps,
    currentFormStep: formSteps,
    projectData,
  } = useProjectDataStore();
  const {
    towerFormData,
    projectBookingStatus,
    projectPricingStatus,
    projectConstructionStatus,
  } = useTowerUnitStore();
  const [UnitCardDataToPost, setUnitCardDataToPost] = useState<
    UnitCardDataToPost[]
  >([]);

  useEffect(() => {
    setUnitCardDataToPost([]);
  }, [projectData.selectedProject]);

  async function submit() {
    const toPost: UnitCardDataToPost[] = [];
    const towerDataToPost: {
      tower_id: string;
      typical_floor_unit_no_max: string;
      max_floor: string;
      ground_floor_unit_no_max: string;
      ground_floor_name: string;
    }[] = [];
    let uploadTowerFloorPlan = false;
    const formData = new FormData();
    formData.append(
      'project_id',
      projectData.selectedProject!.value.toString()
    );
    towerFormData.map((tower) => {
      tower.towerFloorPlanFile.map((file) => {
        uploadTowerFloorPlan = true;
        formData.append(tower.tower_id.toString(), file.file);
      });
      towerDataToPost.push({
        tower_id: tower.tower_id.toString(),
        typical_floor_unit_no_max: tower.typicalUnitCount,
        max_floor: tower.typicalMaxFloor.toString(),
        ground_floor_unit_no_max: tower.gfUnitCount,
        ground_floor_name: tower.gfName,
      });
      tower.unitCards.map((unitCard) => {
        toPost.push({
          unit_type_id: `${tower.tower_id}_${unitCard.configName}_${unitCard.salableArea}_${unitCard.extent}_${unitCard.facing || 'None'}`,
          tower_id: tower.tower_id.toString(),
          rera_type: unitCard.reraUnitType?.value || null,
          tower_type: tower.towerType,
          unit_type: tower.towerType,
          saleable_area: unitCard.salableArea.toString() || null,
          parking: unitCard.parking.toString() || null,
          extent: unitCard.extent.toString() || null,
          config: unitCard.configName || null,
          confident: unitCard.configVerified,
          wc_count: unitCard.toiletConfig || null,
          other_features: unitCard.otherConfig || null,
          unit_floors: unitCard.unitFloorCount || '1',
          door_no_override: unitCard.doorNoOverride || null,
          type_floors: unitCard.floorNos,
          type_units: unitCard.unitNos,
          facing: unitCard.facing || null,
          is_corner: unitCard.corner,
        });
      });
    });
    setUnitCardDataToPost(toPost);

    toast.promise(
      axiosClient.post('/onboarding/onboardProjectPart2/', {
        unitTypeData: toPost,
        towerData: towerDataToPost,
      }),
      {
        loading: 'Submitting tower-unit data...',
        success: () => {
          return 'Part 2 Data Submitted';
        },
        error: (err) => {
          console.log(err);
          return 'Error';
        },
      }
    );
    if (uploadTowerFloorPlan) {
      toast.promise(
        axiosClient.post('/forms/imgTag/tower', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: 'uploading tower floor plan...',
          success: () => {
            return 'File uploaded';
          },
          error: (err) => {
            console.log(err);
            return 'Error';
          },
        }
      );
    }

    if (
      projectBookingStatus.length > 0 ||
      projectPricingStatus.length > 0 ||
      projectConstructionStatus.length > 0
    ) {
      const projectStatusPromise = axiosClient.post('/projects/status', {
        bookingData: projectBookingStatus,
        pricingData: projectPricingStatus,
        constructionData: projectConstructionStatus,
      });
      await toast.promise(
        projectStatusPromise,
        {
          loading: 'Saving new Project Status...',
          success: 'New Status saved to database.',
          error: 'Something went wrong',
        },
        {
          success: {
            duration: 10000,
          },
        }
      );
    }
  }
  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Project Onboarder v3.0 - Part II
      </h1>
      <div
        className={cn(
          'mb-40 mt-5 flex w-full max-w-full flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        )}
        id='projectTowerForm'
      >
        <StepsUI
          stepValue={formSteps}
          steps={formStepsList}
          setFormSteps={setFormSteps}
        />
        {formSteps === 'Project' && <ProjectContainer />}
        {formSteps === 'Tower' && <TowerContainer />}
        {formSteps === 'Image' && <ImageFormContainer />}
        {formSteps === 'Status' && <StatusContainer />}
        {formSteps === 'Preview' && (
          <PreviewContainer UnitCardDataToPost={UnitCardDataToPost} />
        )}

        {/* PAGINATORS */}
        <div className='mx-auto mt-20 flex w-[50%] justify-between'>
          <button
            className='btn-rezy btn w-28'
            onClick={() => {
              setFormSteps(formStepsList[formStepsList.indexOf(formSteps) - 1]);
            }}
            disabled={formSteps === 'Project'}
          >
            Previous
          </button>

          {formSteps !== 'Preview' && (
            <button
              className='btn-rezy btn w-28'
              onClick={() => {
                setFormSteps(
                  formStepsList[formStepsList.indexOf(formSteps) + 1]
                );
              }}
            >
              Next
            </button>
          )}
          {formSteps === 'Preview' && (
            <button className='btn btn-error w-28 text-white' onClick={submit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
