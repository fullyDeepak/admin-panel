import { inputBoxClass } from '@/app/constants/tw-class';
import ChipInput from '@/components/ui/Chip';
import { nanoid } from 'nanoid';
import RcSelect, { Option } from 'rc-select';
import { BiCopy, BiInfoCircle, BiPlus, BiReset } from 'react-icons/bi';
import { FaRegCopy } from 'react-icons/fa';
import { MdContentPaste } from 'react-icons/md';
import Select, { SingleValue } from 'react-select';
import useDMVDataStore from '../../useDMVDataStore';
import useETLDataStore from '../../useETLDataStore';
import _ from 'lodash';

interface ETLTagDataType {
  showHeading?: boolean;
  isUpdateForm?: boolean;
}

export default function ETLTagData({
  isUpdateForm,
  showHeading = true,
}: ETLTagDataType) {
  const {
    addProjectETLTagCard: addProjectETLCard,
    deleteProjectETLTagCard: deleteProjectETLCard,
    projectFormETLTagData: formProjectETLTagData,
    updateProjectETLTagData: updateProjectETLFormData,
    addNewProjectETLTagCard,
  } = useETLDataStore();
  const { villageOptions } = useDMVDataStore();

  const docIdPattern: RegExp =
    /^(100\d|10[1-9]\d|1[1-9]\d{2}|[2-9]\d{3})-(19[0-9][0-9]|2[0][0-9]{2})-([1-9]\d{1,5}|[1-9])$/gm;
  const notDocIdPattern: RegExp =
    /^(100\d|10[1-9]\d|1[1-9]\d{2}|[2-9]\d{3})-(19[0-9][0-9]|2[0][0-9]{2})-([1-9]\d{1,5}|[1-9])-([1-9]\d{1,5}|[1-9])$/gm;

  return (
    <>
      {showHeading && (
        <h3 className='my-4 text-2xl font-semibold'>ETL Project Tag Data</h3>
      )}
      {formProjectETLTagData.map((etlTagData, index) => (
        <div
          className='moveTransition tower-card relative mb-14 flex flex-col gap-3 rounded-2xl p-10 shadow-[0_0px_8px_rgb(139,92,246,0.6)]'
          key={index}
        >
          <button
            className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
            type='button'
            onClick={() => {
              if (formProjectETLTagData.length > 1) {
                deleteProjectETLCard(etlTagData.id);
              }
            }}
          >
            ✕
          </button>
          <span className='text-center font-semibold'>
            ETL Card id: {etlTagData.id}
          </span>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Village:</span>
            </span>
            <div className='flex-[5]'>
              {isUpdateForm ? (
                <RcSelect
                  showSearch
                  className='w-full'
                  animation='slide-up'
                  optionFilterProp='desc'
                  value={etlTagData.village?.value || undefined}
                  onChange={(e) => {
                    updateProjectETLFormData(etlTagData.id, 'village', {
                      label: '',
                      value: e,
                    });
                  }}
                  placeholder='Select Village'
                >
                  {villageOptions?.map((item, i) => (
                    <Option
                      key={i}
                      value={item.value}
                      className='cursor-pointer'
                      desc={item.label}
                    >
                      {item.label}
                    </Option>
                  ))}
                </RcSelect>
              ) : index === 0 ? (
                <span>{etlTagData.village?.label}</span>
              ) : (
                <Select
                  className='w-full'
                  key={'village'}
                  instanceId={nanoid()}
                  options={villageOptions || undefined}
                  value={etlTagData.village}
                  onChange={(
                    e: SingleValue<{
                      label: string;
                      value: number;
                    }>
                  ) => {
                    updateProjectETLFormData(etlTagData.id, 'village', e);
                  }}
                />
              )}
            </div>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Single Unit?:</span>
            </span>
            <div className='flex flex-[5] items-center gap-5'>
              <input
                className={`toggle ${etlTagData.singleUnit ? 'toggle-success' : ''}`}
                type='checkbox'
                name='towerDoorNo'
                defaultChecked={etlTagData.singleUnit}
                onChange={(e) =>
                  updateProjectETLFormData(
                    etlTagData.id,
                    'singleUnit',
                    e.target.checked
                  )
                }
              />{' '}
              <span>{etlTagData.singleUnit ? 'True' : 'False'}</span>
            </div>
          </label>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Pattern:</span>
            </span>
            <div className='flex w-full flex-[5] items-center gap-5'>
              <input
                className={`${inputBoxClass} !ml-0`}
                name='towerPattern'
                value={etlTagData.etlPattern}
                onChange={(e) =>
                  updateProjectETLFormData(
                    etlTagData.id,
                    'etlPattern',
                    e.target.value
                  )
                }
                placeholder='Tower, Floor, Unit Pattern'
              />
              <button
                className='btn btn-warning flex max-h-11 items-center text-base font-medium'
                type='button'
                onClick={() =>
                  updateProjectETLFormData(
                    etlTagData.id,
                    'etlPattern',
                    '(?<tower>)(?<floor>)(?<unit_number>)'
                  )
                }
              >
                <BiReset size={20} />
                Reset
              </button>
            </div>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Doc ID:</span>
              <span
                className='tooltip'
                data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211'
              >
                <BiInfoCircle size={20} />
              </span>
              <button
                type='button'
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(etlTagData.docId)
                  )
                }
              >
                <FaRegCopy />
              </button>
            </span>
            <ChipInput
              chips={etlTagData.docId}
              updateFormData={updateProjectETLFormData}
              updateId={etlTagData.id}
              updateKey='docId'
              regexPattern={docIdPattern}
            />
          </div>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Root Docs:</span>
              <span
                className='tooltip'
                data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211'
              >
                <BiInfoCircle size={20} />
              </span>{' '}
              <button
                type='button'
                onClick={async () =>
                  updateProjectETLFormData(
                    etlTagData.id,
                    'rootDocs',
                    etlTagData.rootDocs.concat(
                      JSON.parse(await navigator.clipboard.readText())
                    )
                  )
                }
              >
                <MdContentPaste />
              </button>
            </span>
            <ChipInput
              chips={etlTagData.rootDocs}
              updateFormData={updateProjectETLFormData}
              updateId={etlTagData.id}
              updateKey='rootDocs'
              regexPattern={docIdPattern}
            />
          </div>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Apartment Contains:</span>
            <div className='flex flex-[5] gap-4'>
              <ChipInput
                chips={etlTagData.apartmentContains}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='apartmentContains'
                addTWClass='!ml-0'
                allowTrim={false}
              />
              <div className='flex items-center gap-2'>
                <label
                  className={`swap rounded p-1 ${etlTagData.aptSurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
                >
                  <input
                    type='checkbox'
                    checked={etlTagData.aptSurveyPlotDetails}
                    onChange={(e) =>
                      updateProjectETLFormData(
                        etlTagData.id,
                        'aptSurveyPlotDetails',
                        e.target.checked
                      )
                    }
                  />
                  <div className='swap-on'>AND</div>
                  <div className='swap-off'>&nbsp;OR</div>
                </label>
                <p>Survey Plot Details</p>
              </div>
            </div>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Counterparty Contains:</span>
            <div className='flex flex-[5] gap-4'>
              <ChipInput
                chips={etlTagData.counterpartyContains}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='counterpartyContains'
                addTWClass='!ml-0'
                allowTrim={false}
              />
              <div className='flex items-center gap-2'>
                <label
                  className={`swap rounded p-1 ${etlTagData.counterpartySurveyPlotDetails ? 'bg-green-200' : 'bg-rose-200'}`}
                >
                  <input
                    type='checkbox'
                    checked={etlTagData.counterpartySurveyPlotDetails}
                    onChange={(e) =>
                      updateProjectETLFormData(
                        etlTagData.id,
                        'counterpartySurveyPlotDetails',
                        e.target.checked
                      )
                    }
                  />
                  <div className='swap-on'>AND</div>
                  <div className='swap-off'>&nbsp;OR</div>
                </label>
                <p>Survey Plot Details</p>
              </div>
            </div>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Survey & Plot Equals:</span>
            <div className='flex flex-[5] gap-2'>
              <ChipInput
                chips={etlTagData.surveyEquals}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='surveyEquals'
                addTWClass='!ml-0'
                enableGeneration
                generationKey='-'
              />
              <ChipInput
                chips={etlTagData.plotEquals}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='plotEquals'
                addTWClass='ml-0'
                enableGeneration
                generationKey='-'
              />
            </div>
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Survey & Plot Contains:</span>
            <div className='flex flex-[5] gap-2'>
              <ChipInput
                chips={etlTagData.surveyContains}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='surveyContains'
                addTWClass='!ml-0'
                enableGeneration
                generationKey='-'
              />
              <ChipInput
                chips={etlTagData.plotContains}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='plotContains'
                addTWClass='ml-0'
                enableGeneration
                generationKey='-'
              />
            </div>
          </label>
          <div className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex-[2]'>Locality contains, W-B, Plot:</span>
            <div className='flex flex-[5] gap-2'>
              <ChipInput
                chips={etlTagData.localityContains}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='localityContains'
                addTWClass='!ml-0'
                placeholder='Add chips'
              />
              <ChipInput
                chips={etlTagData.wardBlock}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='wardBlock'
                addTWClass='ml-0'
                placeholder='Add chips'
                regexPattern={/^\d{1,2}-\d{1,2}$/gm}
              />
              <ChipInput
                chips={etlTagData.localityPlot}
                updateFormData={updateProjectETLFormData}
                updateId={etlTagData.id}
                updateKey='localityPlot'
                addTWClass='ml-0'
                placeholder='Add chips'
              />
            </div>
          </div>
          <div className='flex flex-col gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Recommended Municipal Door Numbers:</span>
            </span>
            <table>
              <thead>
                <tr>
                  <th className='border border-solid border-slate-400'>
                    Door No.
                  </th>
                  <th className='border border-solid border-slate-400'>
                    Unit Numbers
                  </th>
                  <th className='border border-solid border-slate-400'>
                    Occurrence
                  </th>
                </tr>
              </thead>
              <tbody>
                {etlTagData.suggestedDoorNumberStartsWith
                  .sort(
                    (a, b) =>
                      -(parseInt(a.split(':')[2]) - parseInt(b.split(':')[2]))
                  )
                  .map((item, index) => (
                    <tr
                      className='border-collapse cursor-pointer hover:bg-slate-50'
                      key={index}
                      onClick={() =>
                        updateProjectETLFormData(
                          etlTagData.id,
                          'doorNoStartWith',
                          _.uniq([
                            ...etlTagData.doorNoStartWith,
                            item.split(':')[0],
                          ])
                        )
                      }
                    >
                      <td className='border border-solid border-slate-400'>
                        {item.split(':')[0]}
                      </td>
                      <td className='border border-solid border-slate-400'>
                        {item.split(':')[1]}
                      </td>
                      <td className='border border-solid border-slate-400'>
                        {item.split(':')[2]}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Door no. start with:</span>
            </span>
            <ChipInput
              chips={etlTagData.doorNoStartWith}
              updateFormData={updateProjectETLFormData}
              updateId={etlTagData.id}
              updateKey='doorNoStartWith'
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Apartment name doesn&apos;t contains:</span>
            </span>
            <ChipInput
              chips={etlTagData.aptNameNotContains}
              updateFormData={updateProjectETLFormData}
              updateId={etlTagData.id}
              updateKey='aptNameNotContains'
            />
          </label>
          <label className='flex flex-wrap items-center justify-between gap-5'>
            <span className='flex flex-[2] items-center'>
              <span>Doc ID doesn&apos;t equals:</span>
              <span
                className='tooltip'
                data-tip='Should be formatted as DDDD-YYYY-N. eg:1525-2013-5211-8'
              >
                <BiInfoCircle size={20} />
              </span>
            </span>
            <ChipInput
              chips={etlTagData.docIdNotEquals}
              updateFormData={updateProjectETLFormData}
              updateId={etlTagData.id}
              updateKey='docIdNotEquals'
              regexPattern={notDocIdPattern}
            />
          </label>
          <div className='absolute -bottom-6 -left-5 z-10 flex w-full px-28'>
            <button
              type='button'
              className='btn btn-md mx-auto flex items-center border-none bg-violet-300 hover:bg-violet-400'
              onClick={() => {
                const newData = {
                  id:
                    Math.max(...formProjectETLTagData.map((data) => data.id)) +
                    1,
                };
                addNewProjectETLTagCard(newData);
              }}
            >
              <BiPlus size={30} /> <span>Add</span>
            </button>
            <button
              type='button'
              className='btn btn-md mx-auto flex items-center border-none bg-violet-300 hover:bg-violet-400'
              onClick={() => {
                const newData = {
                  ...etlTagData,
                  id:
                    Math.max(...formProjectETLTagData.map((data) => data.id)) +
                    1,
                  village: undefined,
                };
                addProjectETLCard(newData);
              }}
            >
              <BiCopy size={30} /> <span>Duplicate</span>
            </button>
          </div>
        </div>
      ))}
    </>
  );
}