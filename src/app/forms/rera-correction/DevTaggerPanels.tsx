import dynamic from 'next/dynamic';
import { useState } from 'react';

const DevTaggerForm = dynamic(() => import('./../dev-tagger/PageContainer'), {
  loading: () => <p>Loading...</p>,
});

export default function DevTaggerPanels() {
  const [showPanel, setShowPanel] = useState<
    | 'showOnlyDevTaggerWithJV'
    | 'showOnlyDevTaggerWithoutJV'
    | 'showDevGroupSelectionPanel'
    | null
  >(null);
  return (
    <div>
      <h2 className='py-5 text-center text-2xl font-semibold'>
        Open Dev Tagger Panels
      </h2>
      <dialog id='dev-panel' className='modal'>
        <div className='modal-box flex min-w-[90vw] flex-col gap-y-10'>
          <form method='dialog'>
            <button className='absolute right-5 top-1 my-5 flex size-8 items-center justify-center rounded-full p-3 hover:bg-gray-200'>
              ✕
            </button>
          </form>
          {showPanel === 'showOnlyDevTaggerWithoutJV' && (
            <DevTaggerForm showOnlyDevTaggerWithoutJV />
          )}
          {showPanel === 'showOnlyDevTaggerWithJV' && (
            <DevTaggerForm showOnlyDevTaggerWithJV />
          )}
          {showPanel === 'showDevGroupSelectionPanel' && (
            <DevTaggerForm showDevGroupSelectionPanel />
          )}
        </div>
      </dialog>
      <div className='flex w-full justify-around'>
        <button
          className='btn'
          onClick={() => {
            setShowPanel('showOnlyDevTaggerWithoutJV');
            (
              document.getElementById('dev-panel') as HTMLDialogElement
            ).showModal();
          }}
        >
          Generate Master Dev ID
        </button>
        <button
          className='btn'
          onClick={() => {
            setShowPanel('showOnlyDevTaggerWithJV');
            (
              document.getElementById('dev-panel') as HTMLDialogElement
            ).showModal();
          }}
        >
          Generate JV ID
        </button>
        <button
          className='btn'
          onClick={() => {
            setShowPanel('showDevGroupSelectionPanel');
            (
              document.getElementById('dev-panel') as HTMLDialogElement
            ).showModal();
          }}
        >
          Generate Group ID
        </button>
      </div>
    </div>
  );
}
