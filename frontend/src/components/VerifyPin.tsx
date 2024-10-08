import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import type { VerifyPinProps } from '../types';

function VerifyPin({ slug }: VerifyPinProps) {
  const pinRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);

  async function verifyPin() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: slug, pin: pinRef.current?.value }),
      });
      const response = await res.json();
      if (res.ok) {
        // console.log(response.message);
        if (pinRef.current !== null) {
          pinRef.current.value = '';
        }
        navigate(`/files`);
      } else {
        console.error(response.message);
        setInvalid(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = () => {
    verifyPin();
  };
  return (
    <>
      <section id='verifyPin' className='flex flex-col justify-center items-center mt-10 mb-5'>
        <h2>Email sent!</h2>
        <h3>Enter the pin code here to continue:</h3>
        <div className='flex flex-col justify-center gap-4 mx-5 my-10'>
          <input
            type='text'
            name='code'
            id='code'
            minLength={6}
            maxLength={6}
            ref={pinRef}
            className='input input-bordered input-accent w-full '
          />
          <button type='button' onClick={handleSubmit} className='btn btn-active btn-accent'>
            Submit
          </button>
        </div>

        {invalid && <p>invalid code!</p>}
      </section>
    </>
  );
}

export default VerifyPin;
