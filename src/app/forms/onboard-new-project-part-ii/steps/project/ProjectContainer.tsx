import { useProjectDataStore } from '../../useProjectDataStore';
import ProjectDropdown from './ProjectDropdown';
import ImageFormContainer from '../image/ImageFormContainer';

export default function ProjectContainer() {
  const { projectData } = useProjectDataStore();

  return (
    <div className='flex flex-col gap-4'>
      <ProjectDropdown />
      {/* {projectData.selectedProject?.value && <ImageFormContainer />} */}
      <ImageFormContainer />
    </div>
  );
}
