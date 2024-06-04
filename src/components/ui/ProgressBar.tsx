type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress = 50 }: ProgressBarProps) {
  return (
    <div>
      <div
        style={{ marginInlineStart: `calc(${progress}% - 1.25rem)` }}
        className={`mb-2 inline-block rounded-lg border ${progress >= 95 ? 'border-green-200' : 'border-blue-200'} bg-blue-50 px-1.5 py-0.5 text-xs font-medium ${progress >= 95 ? 'text-green-600' : 'text-blue-600'} transition-all duration-200`}
      >
        {progress}%
      </div>
      <div
        className='flex h-2 w-full overflow-hidden rounded-full bg-gray-200'
        role='progressbar'
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{ width: `${progress}%` }}
          className={`flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full ${progress >= 95 ? 'bg-green-600' : 'bg-blue-600'} text-center text-xs text-white transition-all duration-200`}
        ></div>
      </div>
    </div>
  );
}
