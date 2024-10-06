import type { FallbackProps } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <>
      <div className='error-boundary flex flex-col justify-center items-center m-10 gap-5' role='alert'>
        <p>Something went wrong:</p>
        <div className='alert alert-error flex '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 shrink-0 stroke-current'
            fill='none'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>{error.message}</span>
        </div>

        <button onClick={resetErrorBoundary} className='btn btn-outline'>
          Try again
        </button>
        <p>or</p>

        <a href='/' className='link link-info'>
          Go back Home
        </a>
      </div>
    </>
  );
}

export default Fallback;
