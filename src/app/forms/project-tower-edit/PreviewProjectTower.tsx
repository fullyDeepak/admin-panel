import TanstackReactTable from '@/components/tables/TanstackReactTable';

type PreviewProjectTowerProps = {
  projectFormData: {
    village_id: number;
    projectName: string;
    layoutName: string;
    developer: string;
    developerGroup: string;
    projectType: string;
    projectSubType: string;
    projectDesc: string;
    amenitiesTags: { label: string; value: number }[];
    surveyEqual: string[];
    surveyContains: string[];
    plotEqual: string[];
    apartmentContains: string;
    counterpartyContains: string;
    projectCoordinates: string[];
    aptSurveyPlotDetails: boolean;
    counterpartySurveyPlotDetails: boolean;
  };
  towerFormData: {
    id: number;
    projectPhase: number;
    reraId: string;
    towerType: string;
    towerName: string;
    etlUnitConfigs: { configName: string; minArea: number; maxArea: number }[];
    minFloor: number;
    maxFloor: number;
    groundFloorName: string;
    deleteFullUnitNos: string;
    exceptionUnitNos: string;
    groundFloorUnitNoMax: string;
    groundFloorUnitNoMin: string;
    typicalFloorUnitNoMax: string;
    typicalFloorUnitNoMin: string;
    towerDoorNo: string;
    validTowerUnits: string[][];
  }[];
};

const camelToFlat = (c: string) => (
  (c = c.replace(/[A-Z]/g, ' $&')), c[0].toUpperCase() + c.slice(1)
);

export default function PreviewProjectTower({
  projectFormData,
  towerFormData,
}: PreviewProjectTowerProps) {
  const towerColumns = [
    {
      header: 'Id',
      accessorKey: 'id',
    },
    {
      header: 'Project Phase',
      accessorKey: 'projectPhase',
    },
    {
      header: 'Rera Id',
      accessorKey: 'reraId',
    },
    {
      header: 'Tower Type',
      accessorKey: 'towerType',
    },
    {
      header: 'Tower ID',
      accessorKey: 'towerId',
    },
    {
      header: 'Tower Name',
      accessorKey: 'towerName',
    },
    {
      header: 'Tower Door No',
      accessorKey: 'towerDoorNo',
    },
    {
      header: 'Max Floor',
      accessorKey: 'maxFloor',
    },
    {
      header: 'Ground Floor Name',
      accessorKey: 'groundFloorName',
    },
    {
      header: 'Delete Full Unit Nos',
      accessorKey: 'deleteFullUnitNos',
    },
    {
      header: 'Exception Unit Nos',
      accessorKey: 'exceptionUnitNos',
    },
    {
      header: 'Ground Floor Unit No Min',
      accessorKey: 'groundFloorUnitNoMin',
    },
    {
      header: 'Ground Floor Unit No Max',
      accessorKey: 'groundFloorUnitNoMax',
    },
    {
      header: 'Typical Floor Unit No Min',
      accessorKey: 'typicalFloorUnitNoMin',
    },
    {
      header: 'Typical Floor Unit No Max',
      accessorKey: 'typicalFloorUnitNoMax',
    },
  ];
  const etlColumns = [
    {
      header: 'Card Id',
      accessorKey: 'id',
    },
    {
      header: 'Config Name',
      accessorKey: 'configName',
    },
    {
      header: 'Min Area',
      accessorKey: 'minArea',
    },
    {
      header: 'Max Area',
      accessorKey: 'maxArea',
    },
  ];
  let etlUnitConfigs: {
    id: number;
    configName: string;
    minArea: number;
    maxArea: number;
  }[] = [];
  towerFormData.map((item) =>
    item.etlUnitConfigs.map((etl) =>
      etlUnitConfigs.push({ ...etl, id: item.id })
    )
  );

  projectFormData.amenitiesTags.map((item) => item.label);
  const amenitiesLabels: string[] = [];
  projectFormData.amenitiesTags.map((item) => amenitiesLabels.push(item.label));
  console.log(projectFormData);

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Project Data</p>
        <div className='flex flex-col rounded-lg border-4 p-3 '>
          <div className='mb-3 flex items-center justify-between gap-5 border-b-2 bg-slate-100'>
            <span className='flex-[4] p-2 font-semibold'>Field Name</span>
            <span className='flex-[5] font-semibold '>Value</span>
          </div>
          {Object.entries(projectFormData).map(([key, value]) => (
            <div
              className='flex justify-end gap-5 border-b-2 p-3  hover:bg-slate-50'
              key={key}
            >
              <span className='flex-[1] self-center border-r-2 font-semibold'>
                {camelToFlat(key)}
              </span>
              {value &&
              Array.isArray(value) &&
              value.length > 0 &&
              value[0].constructor === Object ? (
                <span className='flex-[1] '>
                  {value
                    .map((item) => {
                      if (typeof item !== 'string') {
                        return item.label;
                      }
                    })
                    .join(', ')}
                </span>
              ) : (
                <span className='flex-[1] '>
                  {typeof value === 'boolean'
                    ? JSON.stringify(value)
                    : (value as string)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Tower Data</p>
        <div className='overflow-auto'>
          <TanstackReactTable
            columns={towerColumns}
            data={towerFormData}
            enableSearch={false}
            showPagination={false}
          />
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>
          ETL Unit Config Data
        </p>
        <TanstackReactTable
          columns={etlColumns}
          data={etlUnitConfigs}
          enableSearch={false}
          showPagination={false}
        />
      </div>
    </div>
  );
}
