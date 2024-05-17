import Link from 'next/link';
import { GoShieldCheck, GoShieldX } from 'react-icons/go';

export default function SignUpSuccess() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex flex-col items-center space-y-5'>
        <GoShieldCheck size={100} className='text-green-600' />
        <h1 className='text-4xl font-bold'>Account Created</h1>
        <p>Go back to login screen to access Dashboard.</p>
        <Link
          href={'/'}
          className='btn max-h-4 border-none bg-indigo-500 text-white hover:bg-indigo-600'
        >
          Home
        </Link>
      </div>
    </div>
  );
}
