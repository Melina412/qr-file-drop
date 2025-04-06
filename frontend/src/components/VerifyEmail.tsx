import { useRef, useState } from 'react';
import type { VerifyEmailProps } from '../types';

function VerifyEmail({ setEmailSent, response, setResponse, slug }: VerifyEmailProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  // console.log({ response });
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  async function verifyEmail() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode/verify/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailRef.current?.value }),
      });
      const response = await res.json();
      setResponse(response);
      if (res.ok) {
        setEmailSent(true);
        // console.log(response.message);
        if (emailRef.current !== null) {
          emailRef.current.value = '';
        }
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = () => {
    setButtonClicked(true);
    verifyEmail();
    if (emailRef.current !== null) {
      // emailInput = emailRef.current.value;
      // console.log({ emailInput });
    }
  };
  return (
    <>
      <section id='verifyEmail'>
        <h2 className='text-xl m-5'>
          User <span className='text-primary'>{response?.data.username} </span>
          wants to share files with you. Please confirm your identity by verifying your email address.
        </h2>

        <div className='flex flex-col justify-center gap-4 mx-5 my-10'>
          <label className='input input-bordered flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'>
              <path d='M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z' />
              <path d='M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z' />
            </svg>
            <input type='email' className='grow' placeholder='Email' ref={emailRef} />
          </label>
          {!buttonClicked ? (
            <button type='button' onClick={handleSubmit} className='btn btn-active btn-accent'>
              Submit
            </button>
          ) : (
            <div className='loading loading-spinner text-accent m-auto'></div>
          )}
        </div>
      </section>
    </>
  );
}

export default VerifyEmail;
