import Link from 'next/link';

export default function Home() {
  return (
    <main className='mt-32 flex flex-col items-center justify-center gap-5'>
      <Link
        className='btn bg-violet-700 text-white hover:bg-violet-800'
        href={'/forms'}
      >
        Go to Forms
      </Link>
      <Link
        className='btn bg-violet-700 text-white hover:bg-violet-800'
        href={'/dashboards'}
      >
        Go to Dashboards
      </Link>
      <Link
        className='btn bg-violet-700 text-white hover:bg-violet-800'
        href={'/village-project-cleaner'}
      >
        Go to Village Project Cleaner
      </Link>
    </main>
  );
}
