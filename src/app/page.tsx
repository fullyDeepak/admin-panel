import Link from 'next/link';

export default function Home() {
  return (
    <main className='mt-32 flex flex-col items-center justify-center gap-5'>
      <Link
        className='btn bg-rose-800 text-white hover:bg-rose-500'
        href={'/forms'}
      >
        Go to Forms
      </Link>
    </main>
  );
}
