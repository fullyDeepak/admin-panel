import Keywords from './Keywords';

export async function KeywordTagger() {
  return (
    <>
      <div className='mx-auto mt-10 flex w-full flex-col'>
        <h1 className='self-center text-2xl md:text-3xl'>Keyword Tagger</h1>
        <div className='z-10 mt-5 flex min-h-screen w-full max-w-full flex-col gap-3 self-center rounded p-0 shadow-none md:max-w-[80%] md:p-10 md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          {/* 1 Keyword Tagger to Tag Landlord and Developer Keywords*/}
          {/* Show Keywords from TM | RERA || mapped */}
          <Keywords />
        </div>
      </div>
    </>
  );
}