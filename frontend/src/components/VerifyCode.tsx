import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

function VerifyCode() {
  const params = useParams();
  let path = params.id;
  // console.log({ path });

  const codeRef = useRef<HTMLInputElement>(null);
  let codeInput = '';

  const navigate = useNavigate();

  const [invalid, setInvalid] = useState(false);

  async function verifyCode() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codeInput, path }),
      });
      const response = await res.json();
      if (res.ok) {
        // console.log(response.message);
        if (codeRef.current !== null) {
          codeRef.current.value = '';
        }
        navigate(`/files/${path}`);
      } else {
        console.error(response.message);
        setInvalid(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = () => {
    if (codeRef.current !== null) {
      codeInput = codeRef.current.value;
      // console.log({ codeInput });
    }

    verifyCode();
  };

  return (
    <section>
      <div className='flex flex-col justify-center gap-4 mx-5 my-10'>
        <input
          type='text'
          name='code'
          id='code'
          minLength={6}
          maxLength={6}
          ref={codeRef}
          className='input input-bordered input-accent w-full '
        />
        <button type='submit' onSubmit={handleSubmit} className='btn btn-active btn-accent'>
          Submit
        </button>
      </div>

      {invalid && <p>invalid code!</p>}
    </section>
  );
}

export default VerifyCode;
