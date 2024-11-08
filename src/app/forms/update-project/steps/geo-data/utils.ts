import { ProjectCordWithinVillage } from "@/app/forms/village-project-cleaner/MapUI";
import { useOnboardingDataStore } from "../../useOnboardingDataStore";
import axiosClient from "@/utils/AxiosClient";
import toast from "react-hot-toast";

export async function handleShowOnMap() {
  const { onboardingData, updateOnboardingData } = useOnboardingDataStore.getState();
  if (!onboardingData.selectedVillage) return;
  updateOnboardingData({ mapData: null });
  const res = axiosClient.get<ProjectCordWithinVillage>(
    '/map/project-cord-within-village',
    {
      params: {
        village_id: onboardingData.selectedVillage.value,
        query: `${onboardingData.mapInputValue} ${onboardingData.selectedVillage.label.split(':')[1]}`,
      },
    }
  );
  toast.promise(
    res,
    {
      loading: 'Loading...',
      success: (data) => {
        updateOnboardingData({ mapData: data.data.data });
        return `Successfully loaded ${data.data.data.length} projects.`;
      },
      error: 'Error',
    },
    { duration: 5000 }
  );
}