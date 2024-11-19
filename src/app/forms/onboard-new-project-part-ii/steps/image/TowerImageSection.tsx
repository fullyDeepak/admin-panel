import { useProjectImageStore } from '../../useProjectImageStore';
import { useTowerUnitStore } from '../../useTowerUnitStore';
import FileList from './FileList';
import TowerPDFImageSelector from './TowerPDFImageSelector';

export default function TowerImageSection() {
  const { imagesStore } = useProjectImageStore();
  const { towerFormData, removeTowerFloorPlanFile, setTowerFloorPlanFile } =
    useTowerUnitStore();

  return (
    <div>
      <h3 className='mb-5 mt-10 text-center text-2xl font-semibold'>
        Section: Tower Image Form
      </h3>
      {imagesStore.brochureFile?.length > 0 && (
        <section className='space-y-5 px-2 pb-5'>
          <h4 className='text-xl font-semibold'>
            Section: Select From Project Brochure
          </h4>
          <TowerPDFImageSelector />
        </section>
      )}
      <section className='space-y-5 px-2'>
        <h4 className='text-xl font-semibold'>
          Section: Individual Tower Plan
        </h4>
        {towerFormData.map((tower, idx) => (
          <div key={idx} className='space-y-2'>
            <div className='relative flex flex-wrap items-center justify-between gap-5'>
              <span className='flex-[3] text-base md:text-xl'>
                Select Tower {tower.towerNameETL}:
              </span>
              <div className='flex flex-[5] items-center gap-2'>
                <input
                  type='file'
                  className='file-input file-input-bordered h-10 w-full'
                  multiple
                  id={`tower-plan-file-${tower.tower_id}`}
                  accept='image/*'
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      Array.from(e.target.files).forEach((file) => {
                        setTowerFloorPlanFile(tower.tower_id, {
                          name: file.name,
                          file: file,
                        });
                      });
                    }
                  }}
                />
              </div>
            </div>
            <FileList
              imagesList={tower.towerFloorPlanFile}
              imgKey='otherDocs'
              setImageFile={(key, file) => {
                setTowerFloorPlanFile(key as number, file);
              }}
              removeImageFile={(key, fileName) =>
                removeTowerFloorPlanFile(Number(key), fileName)
              }
              customModalSuffix={`${tower.tower_id}`}
              towerId={tower.tower_id}
            />
            <hr className='border-[1.5px] border-violet-300' />
          </div>
        ))}
      </section>
    </div>
  );
}
