import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import type { VerifyCodeProps } from '../types';
import { CheckIcon } from '@heroicons/react/24/solid';

function VerifyCode({ verified, setVerified, setLoading, response, setResponse, slug }: VerifyCodeProps) {
  async function verifyCode() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode/verify/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();
      setResponse(response);
      if (res.ok) {
        // console.log(response.message);
        setTimeout(() => {
          setVerified(true);
        }, 1000);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    verifyCode();
  }, []);

  return (
    <section id='verifyCode'>
      <div className='flex flex-col justify-center gap-4 mx-5 my-10 items-center'>
        {response !== null && response?.success !== false ? (
          <>
            <p>verifying code...</p>
            {!verified ? (
              <>
                <div className='loading loading-spinner text-accent m-2'></div>
              </>
            ) : (
              <div>
                <CheckIcon className='h-8 w-8 text-accent' />
              </div>
            )}
          </>
        ) : (
          <div>
            {response?.success === false && (
              <>
                <p className='m-5'>Something went wrong</p>
                <div role='alert' className='alert alert-error flex'>
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
                  <span>{response?.message}</span>
                </div>
                <div className='m-5'>
                  <p>You believe this is a mistake?</p>
                  <Link
                    to={`mailto:melina.webdev@gmail.com?subject=error: ${response?.message}`}
                    className='link link-error'>
                    Contact admin
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default VerifyCode;
