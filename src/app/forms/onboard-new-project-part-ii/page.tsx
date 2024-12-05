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
import StatusContainer from './steps/status-pricing/StatusContainer';
import { useProjectImageStore } from './useProjectImageStore';

export default function Page() {
  const {
    formStepsList,
    setFormSteps,
    currentFormStep: formSteps,
    projectData,
    updateProjectData,
  } = useProjectDataStore();
  const {
    towerFormData,
    projectBookingStatus,
    projectPricingStatus,
    projectConstructionStatus,
    lockUnitType,
    resetStatusFormData,
    resetTowerUnitStore,
  } = useTowerUnitStore();
  const [UnitCardDataToPost, setUnitCardDataToPost] = useState<
    UnitCardDataToPost[]
  >([]);

  const { imagesStore, resetImageStore } = useProjectImageStore();

  useEffect(() => {
    setUnitCardDataToPost([]);
  }, [projectData.selectedProject]);

  async function submit() {
    const toPost: UnitCardDataToPost[] = [];
    const towerDataToPost: {
      tower_id: string;
      typical_floor_unit_no_min: string;
      typical_floor_unit_no_max: string;
      max_floor: string;
      ground_floor_unit_no_min: string;
      ground_floor_unit_no_max: string;
      ground_floor_name: string;
    }[] = [];
    let uploadTowerFloorPlan = false;
    const projectImgFormData = new FormData();
    const towerImgFormData = new FormData();
    const unitImgFormData = new FormData();

    projectImgFormData.append(
      'project_id',
      projectData.selectedProject!.value.toString()
    );
    towerImgFormData.append(
      'project_id',
      projectData.selectedProject!.value.toString()
    );
    unitImgFormData.append(
      'project_id',
      projectData.selectedProject!.value.toString()
    );

    imagesStore.brochureFile.map((file) => {
      const key = { type: 'brochure' };
      projectImgFormData.append(
        encodeURIComponent(JSON.stringify(key)),
        file.file
      );
    });
    imagesStore.masterPlanFile.map((file) => {
      const key = { type: 'project_master_plan', label: file.label };
      projectImgFormData.append(
        encodeURIComponent(JSON.stringify(key)),
        file.file
      );
    });
    imagesStore.primaryImageFile.map((file) => {
      const key = { type: 'project_primary_image', label: file.label };
      projectImgFormData.append(
        encodeURIComponent(JSON.stringify(key)),
        file.file
      );
    });
    imagesStore.otherImageFile.map((file) => {
      const key = { type: 'project_image', label: file.label };
      projectImgFormData.append(
        encodeURIComponent(JSON.stringify(key)),
        file.file
      );
    });
    imagesStore.otherDocs.map((file) => {
      const key = { type: 'other_doc', label: file.label };
      projectImgFormData.append(
        encodeURIComponent(JSON.stringify(key)),
        file.file
      );
    });

    towerFormData.map((tower) => {
      tower.towerFloorPlanFile.map((file) => {
        uploadTowerFloorPlan = true;
        towerImgFormData.append(tower.tower_id.toString(), file.file);
      });
      towerDataToPost.push({
        tower_id: tower.tower_id.toString(),
        typical_floor_unit_no_min: tower.typicalMinUN,
        typical_floor_unit_no_max: tower.typicalMaxUN,
        max_floor: tower.maxFloor.toString(),
        ground_floor_unit_no_min: tower.gfUnitMinUN,
        ground_floor_unit_no_max: tower.gfUnitMaxUN,
        ground_floor_name: tower.gfName,
      });
      tower.unitCards.map((unitCard) => {
        const unitTypeId = `${tower.tower_id}_${unitCard.configName || 'None'}_${unitCard.salableArea || 'None'}_${unitCard.extent || '0'}_${unitCard.facing || 'None'}`;
        if (unitCard.unitFloorPlanFile) {
          unitImgFormData.append(
            encodeURIComponent(unitTypeId),
            unitCard.unitFloorPlanFile?.file
          );
        }
        toPost.push({
          unit_type_id: unitTypeId,
          project_id: projectData.selectedProject!.value,
          tower_id: tower.tower_id.toString(),
          rera_type: unitCard.reraUnitType?.value || null,
          tower_type: tower.towerType,
          unit_type: tower.towerType,
          saleable_area: unitCard.salableArea?.toString() || null,
          parking: unitCard.parking?.toString() || null,
          extent: unitCard.extent?.toString() || null,
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
        project_id: projectData.selectedProject!.value,
        unitTypeData: toPost,
        towerData: towerDataToPost,
        lockUnitType: lockUnitType,
      }),
      {
        loading: 'Submitting tower-unit data...',
        success: () => {
          return 'Part 2 Data Submitted';
        },
        error: (err) => {
          console.log(err);

          return 'Error while submitting tower-unit data';
        },
      },
      { success: { duration: 5000 }, error: { duration: 10000 } }
    );

    if ([...projectImgFormData.entries()].length > 1) {
      toast.promise(
        axiosClient.post('/forms/imgTag/projects', projectImgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: 'uploading project docs and images...',
          success: () => {
            resetImageStore();
            return 'Project docs and images uploaded';
          },
          error: (err) => {
            console.log(err);
            return 'Error while submitting projects docs';
          },
        },
        { success: { duration: 5000 }, error: { duration: 10000 } }
      );
    }
    if (uploadTowerFloorPlan) {
      toast.promise(
        axiosClient.post('/forms/imgTag/tower', towerImgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: 'uploading tower floor plan...',
          success: () => {
            return 'Tower floor plan uploaded';
          },
          error: (err) => {
            console.log(err);
            return 'Error while submitting tower floor plan';
          },
        },
        { success: { duration: 5000 }, error: { duration: 10000 } }
      );
    }

    if ([...unitImgFormData.entries()].length > 1) {
      toast.promise(
        axiosClient.post('/forms/imgTag/unit-part-2', unitImgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: 'uploading unit floor plan...',
          success: () => {
            return 'Unit floor plan uploaded';
          },
          error: (err) => {
            console.log(err);
            return 'Error while submitting unit floor plan';
          },
        },
        { success: { duration: 5000 }, error: { duration: 10000 } }
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
          error: 'Error while submitting project status.',
        },
        { success: { duration: 5000 }, error: { duration: 8000 } }
      );
    }
    // after successful submit
    updateProjectData({ selectedProject: null });
    setFormSteps('Project');
    resetStatusFormData();
    resetTowerUnitStore();
  }
  return (
    <div className='mx-auto mt-10 flex w-full flex-col'>
      <h1 className='self-center text-2xl md:text-3xl'>
        Project Onboarder v3.0 - Part II
      </h1>
      <div
        className={cn(
          'mb-40 mt-5 flex w-[80%] flex-col gap-4 self-center rounded p-10 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]',
          formSteps === 'Tower' && 'w-full'
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
