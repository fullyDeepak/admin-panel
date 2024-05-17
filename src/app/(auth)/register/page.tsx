'use client';

import { ErrorMessage } from '@hookform/error-message';
import axios, { AxiosResponse } from 'axios';
import { FieldValues, useForm } from 'react-hook-form';
import SignUpSuccess from './SignUpSuccess';

export default function page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm();

  async function doRegister(data: FieldValues) {
    let response: AxiosResponse<unknown, unknown>;
    try {
      response = await axios.post('/api/auth/register', data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError('email', {
          type: 'alreadyExist',
          message: 'Email already exist.',
        });
      }
    }
    return null;
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50 text-gray-600'>
      {!isSubmitSuccessful ? (
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
                Please fill the detail and create account.
              </p>
              <form className='mb-4' onSubmit={handleSubmit(doRegister)}>
                <div className='mb-4'>
                  <label
                    htmlFor='email'
                    className='mb-2 inline-block text-xs font-medium uppercase text-gray-700'
                  >
                    Name
                  </label>
                  <input
                    className='input input-bordered mt-2 w-full focus:border-indigo-500'
                    type='text'
                    placeholder='Enter your name'
                    {...register('name', {
                      required: 'Name is required',
                      min: 2,
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name='name'
                    render={({ message }) => (
                      <span className='mt-2 text-red-600'>{message}</span>
                    )}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='email'
                    className='mb-2 inline-block text-xs font-medium uppercase text-gray-700'
                  >
                    Email
                  </label>
                  <input
                    className={`${
                      errors?.email?.type === 'alreadyExist'
                        ? 'input-error'
                        : ''
                    } input input-bordered mt-2 w-full focus:border-indigo-500 `}
                    type='email'
                    placeholder='Enter your email'
                    {...register('email', {
                      required: 'Email is required.',
                      pattern: {
                        value: /^\S+@rezy\.in/i, // /^\S+@rezy\.in/i,
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
                      autoComplete='new-password'
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
                    className='none btn w-full border-none bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500'
                  >
                    {isSubmitting ? (
                      <span className='loading loading-spinner bg-white'></span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
              <p className='mb-4 text-center'>
                Already have an account?{' '}
                <a href='/login' className=''>
                  <span className='font-semibold text-indigo-500'>Sign In</span>
                </a>
              </p>
            </div>
          </div>
          {/* /Register */}
        </div>
      ) : (
        <SignUpSuccess />
      )}
    </div>
  );
}
