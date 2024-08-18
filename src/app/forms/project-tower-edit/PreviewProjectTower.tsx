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
    developerKeywords: string[];
    landlordKeywords: string[];
  };
  projectFormETLTagData:
    | {
        id: number;
        village: number | undefined;
        docId: string[];
        docIdNotEquals: string[];
        rootDocs: string[];
        apartmentContains: string[];
        counterpartyContains: string[];
        aptSurveyPlotDetails: boolean;
        counterpartySurveyPlotDetails: boolean;
        localityContains: string[];
        wardBlock: string[];
        localityPlot: string[];
        surveyEquals: string[];
        plotEquals: string[];
        surveyContains: string[];
        plotContains: string[];
        doorNoStartWith: string[];
        aptNameNotContains: string[];
        singleUnit: boolean;
        etlPattern: string;
      }[]
    | undefined;
  towerFormData: {
    id: number;
    projectPhase: number;
    reraId: string;
    towerType: string;
    displayTowerType: string;
    etlTowerName: string;
    towerNameAlias: string;
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
  statusData?: {
    projectPricingStatus: {
      updated_at: string;
      project_id: number;
      tower_id: string;
      updated_value: string;
      updated_field: 'price';
    }[];
    projectBookingStatus: {
      updated_at: string;
      project_id: number;
      tower_id: string;
      updated_value: string;
      updated_field: 'manual_bookings';
    }[];
    projectConstructionStatus: {
      updated_at: string;
      project_id: number;
      tower_id: string;
      updated_field: 'display_construction_status';
      updated_value: string;
    }[];
  };
};

const camelToFlat = (c: string) => (
  (c = c.replace(/[A-Z]/g, ' $&')), c[0].toUpperCase() + c.slice(1)
);

export default function PreviewProjectTower({
  projectFormData,
  towerFormData,
  projectFormETLTagData,
  statusData,
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
      header: 'Display Tower Type',
      accessorKey: 'displayTowerType',
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
      header: 'Min Floor',
      accessorKey: 'minFloor',
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
  const projectFormETLTagDataCol = [
    { header: 'Card ID', accessorKey: 'id' },
    { header: 'Village', accessorKey: 'village' },
    { header: 'Doc IDs', accessorKey: 'docId' },
    { header: 'Doc ID Not Equal', accessorKey: 'docIdNotEquals' },
    { header: 'Root Docs', accessorKey: 'rootDocs' },
    { header: 'Apartment Contains', accessorKey: 'apartmentContains' },
    { header: 'Counterparty Contains', accessorKey: 'counterpartyContains' },
    { header: 'Apt Survey Plot Details', accessorKey: 'aptSurveyPlotDetails' },
    {
      header: 'Counterparty Survey PlotDetails',
      accessorKey: 'counterpartySurveyPlotDetails',
    },
    { header: 'Locality Contains', accessorKey: 'localityContains' },
    { header: 'Ward Block', accessorKey: 'wardBlock' },
    { header: 'Locality Plot', accessorKey: 'localityPlot' },
    { header: 'Survey Equals', accessorKey: 'surveyEquals' },
    { header: 'Plot Equals', accessorKey: 'plotEquals' },
    { header: 'Survey Contains', accessorKey: 'surveyContains' },
    { header: 'Plot Contains', accessorKey: 'plotContains' },
    { header: 'Door No Start With', accessorKey: 'doorNoStartWith' },
    { header: 'Apt Name Not Contains', accessorKey: 'aptNameNotContains' },
    { header: 'Single Unit', accessorKey: 'singleUnit' },
    { header: 'ETL Pattern', accessorKey: 'etlPattern' },
  ];

  let etlUnitConfigs: {
    id: number;
    configName: string;
    minArea: number;
    maxArea: number;
  }[] = [];
  towerFormData?.map((item) =>
    item.etlUnitConfigs.map((etl) =>
      etlUnitConfigs.push({ ...etl, id: item.id })
    )
  );
  console.log({ projectFormData });
  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <p className='text-center text-3xl font-semibold'>Project Details</p>
        <div className='flex flex-col rounded-lg border-4 p-3'>
          <div className='mb-3 flex items-center justify-between gap-5 border-b-2 bg-slate-100 text-center'>
            <span className='flex-[4] p-2 font-semibold'>Field Name</span>
            <span className='flex-[5] font-semibold'>Value</span>
          </div>
          {Object.entries(projectFormData).map(([key, value]) => (
            <div
              className='flex justify-end gap-5 border-b-2 p-3 hover:bg-slate-50'
              key={key}
            >
              <span className='flex-[1] self-center border-r-2 font-semibold'>
                {camelToFlat(key)}
              </span>
              {value &&
              Array.isArray(value) &&
              value.length > 0 &&
              value[0]?.constructor === Object ? (
                <span className='flex-[1]'>
                  {value
                    .map((item) => {
                      if (typeof item !== 'string') {
                        return item.label;
                      }
                    })
                    .join(', ')}
                </span>
              ) : (
                <span className='flex-[1]'>
                  {typeof value === 'boolean'
                    ? JSON.stringify(value)
                    : Array.isArray(value)
                      ? value.join(',')
                      : (value as string)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {projectFormETLTagData && (
        <div className='flex flex-col gap-5'>
          <p className='text-center text-3xl font-semibold'>
            Project ETL Tag Data
          </p>
          <div className='overflow-auto'>
            <TanstackReactTable
              columns={projectFormETLTagDataCol}
              data={projectFormETLTagData}
              enableSearch={false}
              showPagination={false}
            />
          </div>
        </div>
      )}
      {statusData && (
        <div className='flex flex-col gap-5'>
          <p className='text-center text-3xl font-semibold'>
            Project Status Data
          </p>
          <div className='mt-10 flex flex-wrap justify-around gap-4 gap-y-8 transition-all duration-500'>
            {statusData.projectBookingStatus.length > 0 && (
              <div className='max-w-min flex-1 text-sm tabular-nums'>
                <p className='text-center text-xl font-semibold'>
                  Booking data
                </p>
                <div className='flex gap-2 border-y border-t-2 py-1 font-semibold'>
                  <span className='min-w-28'>Updated At</span>
                  <span className='min-w-16'>Tower Id</span>
                  <span className='min-w-28'>Updated field</span>
                  <span className='min-w-28'>Updated Value</span>
                </div>
                {statusData.projectBookingStatus.map((item) => (
                  <div
                    className='flex gap-2 border-y py-1 last:border-b-2'
                    key={item.tower_id}
                  >
                    <span className='min-w-28'>{item.updated_at}</span>
                    <span className='min-w-16 text-center'>
                      {item.tower_id}
                    </span>
                    <span className='min-w-28'>{item.updated_field}</span>
                    <span className='min-w-28 text-center'>
                      {item.updated_value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {statusData.projectPricingStatus.length > 0 && (
              <div className='max-w-min flex-1 text-sm tabular-nums'>
                <p className='text-center text-xl font-semibold'>
                  Pricing data
                </p>
                <div className='flex gap-2 border-y border-t-2 py-1 font-semibold'>
                  <span className='min-w-28'>Updated At</span>
                  <span className='min-w-16'>Tower Id</span>
                  <span className='min-w-28'>Updated field</span>
                  <span className='min-w-28'>Updated Value</span>
                </div>
                {statusData.projectPricingStatus.map((item) => (
                  <div
                    className='flex gap-2 border-y py-1 last:border-b-2'
                    key={item.tower_id}
                  >
                    <span className='min-w-28'>{item.updated_at}</span>
                    <span className='min-w-16 text-center'>
                      {item.tower_id}
                    </span>
                    <span className='min-w-28'>{item.updated_field}</span>
                    <span className='min-w-28 text-center'>
                      {item.updated_value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {statusData.projectConstructionStatus.length > 0 && (
              <div className='max-w-min flex-1 text-sm tabular-nums'>
                <p className='text-center text-xl font-semibold'>
                  Construction Status data
                </p>
                <div className='flex gap-2 border-y border-t-2 py-1 font-semibold'>
                  <span className='min-w-28'>Updated At</span>
                  <span className='min-w-16'>Tower Id</span>
                  <span className='min-w-52'>Updated field</span>
                  <span className='min-w-28'>Updated Value</span>
                </div>
                {statusData.projectConstructionStatus.map((item) => (
                  <div
                    className='flex gap-2 border-y py-1 last:border-b-2'
                    key={item.tower_id}
                  >
                    <span className='min-w-28'>{item.updated_at}</span>
                    <span className='min-w-16 text-center'>
                      {item.tower_id}
                    </span>
                    <span className='min-w-52'>{item.updated_field}</span>
                    <span className='min-w-28 text-center'>
                      {item.updated_value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
