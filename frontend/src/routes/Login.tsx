import { useRef, useState } from 'react';
import type { LoginProps } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import type { ResponseType } from '../types';
import Header from '../components/Header';

function Login({ setLogin }: LoginProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [loginResponse, setLoginResponse] = useState<ResponseType>(null);

  async function userLogin() {
    const user = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    // console.log({ user });

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: 'include',
      });

      if (res.ok) {
        if (emailRef.current?.value !== undefined && passwordRef.current?.value !== undefined) {
          emailRef.current.value = '';
          passwordRef.current.value = '';
        }
        setLogin(true);
        navigate('/user');
      }

      const response = await res.json();
      setLoginResponse(response);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Header />
      <main className='text-center m-auto'>
        <h1 className='text-3xl m-5'>Login</h1>
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
            <input type='email' className='grow' placeholder='Email' id='email' name='email' ref={emailRef} />
          </label>

          <label className='input input-bordered flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'>
              <path
                fillRule='evenodd'
                d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              type='password'
              className='grow'
              placeholder='Password'
              id='password'
              name='password'
              ref={passwordRef}
            />
          </label>
          <div>
            <p className='text-error'>{loginResponse?.message}</p>
          </div>
          <div>
            <button className='btn btn-outline mt-5' onClick={() => userLogin()}>
              Login
            </button>
          </div>
        </div>
        <div className='flex justify-center'>
          <p>
            No account yet?{' '}
            <Link to={'/register'} className='link link-info'>
              Register now!
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default Login;
