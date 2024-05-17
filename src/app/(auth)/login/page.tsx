'use client';

import { ErrorMessage } from '@hookform/error-message';
import { signIn } from 'next-auth/react';
import { useForm, FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  async function doLogin(data: FieldValues) {
    const response = await signIn('credentials', { ...data, redirect: false });
    console.log({ response });
    if (response?.ok) {
      router.push('/');
      router.refresh();
      console.log('redirect here');
    } else if (response?.error) {
      setError('email', { type: 'server', message: response?.error });
    }
  }
  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50 text-gray-600'>
      <div className='relative'>
        <div className='a-z-10 absolute -left-20 -top-20 hidden h-56 w-56 text-indigo-300 sm:block'>
          <svg
            id='patternId'
            width='100%'
            height='100%'
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <pattern
                id='a'
                patternUnits='userSpaceOnUse'
                width={40}
                height={40}
                patternTransform='scale(0.6) rotate(0)'
              >
                <rect x={0} y={0} width='100%' height='100%' fill='none' />
                <path
                  d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5'
                  strokeWidth={1}
                  stroke='none'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width='800%'
              height='800%'
              transform='translate(0,0)'
              fill='url(#a)'
            />
          </svg>
        </div>
        <div className='a-z-10 absolute -bottom-20 -right-20 hidden h-28 w-28 text-indigo-300 sm:block'>
          <svg
            id='patternId'
            width='100%'
            height='100%'
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <pattern
                id='b'
                patternUnits='userSpaceOnUse'
                width={40}
                height={40}
                patternTransform='scale(0.5) rotate(0)'
              >
                <rect x={0} y={0} width='100%' height='100%' fill='none' />
                <path
                  d='M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5'
                  strokeWidth={1}
                  stroke='none'
                  fill='currentColor'
                />
              </pattern>
            </defs>
            <rect
              width='800%'
              height='800%'
              transform='translate(0,0)'
              fill='url(#b)'
            />
          </svg>
        </div>
        <div className='relative flex flex-col rounded-lg border-gray-400 bg-white px-4 shadow-lg sm:w-[30rem]'>
          <div className='flex-auto p-6'>
            <div className='mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden'>
              <a
                href='#'
                className='flex cursor-pointer items-center gap-2 text-indigo-500 no-underline hover:text-indigo-500'
              >
                <span className='flex-shrink-0 text-3xl font-black lowercase tracking-tight opacity-100'>
                  rezy.
                </span>
              </a>
            </div>
            <h4 className='mb-2 font-medium text-gray-700 xl:text-xl'>
              Welcome to Rezy Admin Dashboard!
            </h4>
            <p className='mb-6 text-gray-500'>
              Please sign-in to access your account
            </p>
            <form className='mb-4' onSubmit={handleSubmit(doLogin)}>
              <div className='mb-4'>
                <label
                  htmlFor='email'
                  className='mb-2 inline-block text-xs font-medium uppercase text-gray-700'
                >
                  Email
                </label>
                <input
                  type='text'
                  className={`${
                    errors?.email?.type === 'clientError' ? 'input-error' : ''
                  } input input-bordered mt-2 w-full focus:border-indigo-500`}
                  id='email'
                  placeholder='Enter your email'
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: /^\S+@rezy\.in$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  autoComplete='username'
                />
                <ErrorMessage
                  errors={errors}
                  name='email'
                  render={({ message }) => (
                    <span className='mt-2 text-red-600'>{message}</span>
                  )}
                />
              </div>
              <div className='mb-4'>
                <div className='flex justify-between'>
                  <label
                    className='mb-2 inline-block text-xs font-medium uppercase text-gray-700'
                    htmlFor='password'
                  >
                    Password
                  </label>
                  <a
                    href='#'
                    className='cursor-pointer text-indigo-500 no-underline hover:text-indigo-500'
                  >
                    <small className=' '>Forgot Password?</small>
                  </a>
                </div>
                <div className='relative flex w-full flex-wrap items-stretch'>
                  <input
                    className='input input-bordered mt-2 w-full focus:border-indigo-500'
                    type='password'
                    placeholder='Enter your password'
                    {...register('password', {
                      required: 'You must specify a password',
                      minLength: {
                        value: 6,
                        message: 'Password must have at least 6 characters',
                      },
                    })}
                    autoComplete='current-password'
                  />
                  <ErrorMessage
                    errors={errors}
                    name='password'
                    render={({ message }) => (
                      <span className='mb-2 text-red-600'>{message}</span>
                    )}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn w-full border-none bg-indigo-500 text-white hover:bg-indigo-600 hover:outline-none'
                >
                  {isSubmitting ? (
                    <span className='loading loading-spinner'></span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
            <p className='mb-4 text-center'>
              <a
                href='/register'
                className='cursor-pointer text-indigo-500 no-underline hover:text-indigo-500'
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
