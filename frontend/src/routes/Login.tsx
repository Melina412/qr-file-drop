import { useRef } from 'react';
import type { LoginProps } from '../types';

function Login({ setLogin }: LoginProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function userLogin() {
    const user = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    console.log({ user });

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        if (emailRef.current?.value !== undefined && passwordRef.current?.value !== undefined) {
          emailRef.current.value = '';
          passwordRef.current.value = '';
        }
        setLogin(true);
      }

      const response = await res.json();
      console.log(response.message);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div>
        <p>Login</p>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email' ref={emailRef} />

        <label htmlFor='password'>Passwort</label>
        <input type='password' id='password' name='password' ref={passwordRef} />
        <div>
          <button onClick={() => userLogin()}>Login</button>
        </div>
      </div>
    </>
  );
}

export default Login;
