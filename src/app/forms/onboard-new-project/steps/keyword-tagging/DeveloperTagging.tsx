'use client';

import ReraDocs from '../project-etl-data/ReraDocs';
import Keywords from './Keywords';

export default function DeveloperTagging() {
  // 3 queries
  return (
    <div className='flex flex-col'>
      <div className='pt-6'>
        <ReraDocs />
      </div>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h2 className='self-center text-2xl md:text-3xl'>Keyword Tagger</h2>
        <div className=''>
          {/* 1 Keyword Tagger to Tag Landlord and Developer Keywords*/}
          {/* Show Keywords from TM | RERA || mapped */}
          <Keywords />
        </div>
        {/* <h2 className='mt-10 self-center text-2xl md:text-3xl'>
          Tag Root Docs
        </h2> */}
        {/* <div className='z-10 mt-5 flex min-h-60 w-full max-w-full flex-col gap-3 self-center overflow-x-auto rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'> */}
        {/* Developemnt aggreements : /onboarding/root_docs/development-agreements */}
        {/* <h2 className='mt-10 self-center text-xl md:text-2xl'>
            Development Agreements
          </h2>
          <div className='max-h-[80dvh] overflow-y-auto'>
            <DocAttachTable
              data={developmentAgreements}
              setData={setDevelopmentAgreements}
            />
          </div> */}
        {/* Linked Docs : /onboarding/root_docs/linked-docs*/}
        {/* <h2 className='mt-10 self-center text-xl md:text-2xl'>Linked Docs</h2>
          <div className='max-h-[80dvh] overflow-y-auto'>
            <DocAttachTable data={linkedDocs} setData={setLinkedDocs} />
          </div> */}

        {/* Free From attacher based on village/survey/plot input : /onboarding/root_docs/free-doc-search */}
        {/* 
          <input type='text' />
          <input type='text' /> */}
        {/* </div> */}
      </div>
    </div>
  );
}
