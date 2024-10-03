import { useRef, useState } from 'react';

function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [registered, setRegistered] = useState(false);

  async function register() {
    const user = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    console.log({ user });

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/register`, {
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
        setRegistered(true);
      }

      const response = await res.json();
      console.log(response.message);
    } catch (error) {
      console.error(error);
    }
  }
  console.log({ registered });

  return (
    <>
      <div>
        <p>Register</p>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email' ref={emailRef} />

        <label htmlFor='password'>Passwort</label>
        <input type='password' id='password' name='password' ref={passwordRef} />
        <div>
          <button onClick={() => register()}>Register</button>
        </div>
      </div>
    </>
  );
}

export default Register;
