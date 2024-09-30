import type { FallbackProps } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className='error-boundary' role='alert'>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
      <p>or</p>

      <a href='/'>Go back Home</a>
    </div>
  );
}

export default Fallback;
