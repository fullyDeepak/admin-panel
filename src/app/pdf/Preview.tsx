import { memo } from 'react';

function Preview({ file }: { file: File }) {
  return (
    <div>
      {file && (
        <iframe
          src={URL.createObjectURL(file)}
          style={{ width: '100%', height: '500px' }}
          className='mx-auto rounded-2xl'
        ></iframe>
      )}
    </div>
  );
}

export default memo(Preview);
