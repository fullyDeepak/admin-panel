import { ProjectListItem } from './useProjectMapStore';

type Props = { projectData: ProjectListItem[] };

export default function ProjectListings({ projectData }: Props) {
  return (
    <div className='px-5'>
      <h2 className='text-center text-2xl font-semibold'>
        Project List({projectData.length})
      </h2>
      <div className='m-5 h-[500px] divide-y-2 overflow-auto'>
        {projectData?.map((item) => (
          <div key={item.id} className='py-4'>
            <div>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
