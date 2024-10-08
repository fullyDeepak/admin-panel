import ETLTagData from '../../ETLTagData';
import ProjectMatcherSection from '../../ProjectMatcherSection';
import useDMVDataStore from '../../useDMVDataStore';
import { useProjectStore } from '../../useProjectStore';

export function TagETLDataForm() {
  const {
    addProjectETLTagCard,
    deleteProjectETLTagCard,
    projectFormETLTagData,
    updateProjectETLTagData,
  } = useProjectStore();
  const { villageOptions } = useDMVDataStore();
  return (
    <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
      <ProjectMatcherSection />
      <ETLTagData
        addProjectETLCard={addProjectETLTagCard}
        deleteProjectETLCard={deleteProjectETLTagCard}
        formProjectETLTagData={projectFormETLTagData}
        updateProjectETLFormData={updateProjectETLTagData}
        villageOptions={villageOptions}
        isUpdateForm={true}
      />
    </div>
  );
}
