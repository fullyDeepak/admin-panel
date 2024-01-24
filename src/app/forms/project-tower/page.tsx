'use client';

import axiosClient from '@/utils/AxiosClient';
import axios from 'axios';
import { FormEvent, ReactElement, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import TowerForm from './TowerForm';
import PreviewProjectTower from './PreviewProjectTower';

export default function page() {
  const [responseData, setResponseData] = useState<object | undefined>(
    undefined
  );
  const [year, setYear] = useState<number | undefined>(undefined);
  const [formCount, setFormCount] = useState<number>(0);
  let loadingToastId: string;
  const formsStep: ReactElement[] = [
    <ProjectForm key={1} />,
    <TowerForm key={2} />,
    <PreviewProjectTower key={3} />,
  ];

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    toast.loading(`Saving to database.`, {
      id: loadingToastId,
    });
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.delete('kmlFile');
    const data: { [key: string]: any } = {};
    try {
      for (const [key, value] of formData.entries()) {
        if (key === 'yearCompleted' && value) {
          data[key] = year || 0;
        } else if (
          key !== 'state_id' &&
          key !== 'district_id' &&
          key !== 'mandal_id'
        ) {
          data[key] = value;
        }
      }
      console.log(data);
      if (!data.village_id) {
        throw new Error('Village_id missing');
      }
      const response = await axiosClient.post(
        '/forms/projecttowertagging',
        data
      );
      toast.dismiss(loadingToastId);
      toast.success(`Data Saved to database.`, {
        id: loadingToastId,
        duration: 3000,
      });
      setResponseData(response.data);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(`Something went wrong!!!`, {
        id: loadingToastId,
        duration: 3000,
      });
      if (axios.isAxiosError(error)) {
        setResponseData(error.response?.data as {});
      } else {
        setResponseData(error as {});
      }
    }
  };

  return (
    <div className='mx-auto mt-10 flex w-full flex-col md:w-[80%]'>
      <Toaster />
      <h1 className='self-center text-2xl md:text-3xl'>
        Form: Project Tower Tagging 2
      </h1>
      <form
        className='mt-5 flex w-full max-w-full  flex-col gap-4 self-center rounded p-10 text-sm shadow-none md:max-w-[80%] md:text-lg md:shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        id='projectTowerForm'
        onSubmit={submitForm}
      >
        <ul className='steps mb-5'>
          <li className={`${formCount >= 0 ? 'step-error' : ''} step`}>
            Project
          </li>
          <li className={`${formCount >= 1 ? 'step-error' : ''} step`}>
            Tower
          </li>
          <li className={`${formCount >= 2 ? 'step-error' : ''} step`}>
            Final Preview
          </li>
        </ul>
        {formsStep[formCount]}
        <div className='flex w-full items-center justify-center gap-40 '>
          <button
            type='button'
            className='btn btn-info w-40 text-white'
            disabled={formCount === 0}
            onClick={() => setFormCount((prev) => prev - 1)}
          >
            Previous
          </button>
          {formsStep.length - 1 !== formCount && (
            <button
              type='button'
              className='btn btn-info w-40 text-white'
              onClick={() => setFormCount((prev) => prev + 1)}
            >
              Next
            </button>
          )}
          {formsStep.length - 1 === formCount && (
            <button
              type='button'
              className='btn w-40 border-none bg-rose-500 text-white hover:bg-red-600'
              onClick={() => alert('From Submitted.')}
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {responseData && (
        <p className='my-10 text-center text-xl'>
          {JSON.stringify(responseData)}
        </p>
      )}
      <div className='mt-40'></div>
    </div>
  );
}
