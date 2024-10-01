import { useRef, useState } from 'react';

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [login, setLogin] = useState(false);

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
        credentials: 'include', //! brauche ich glaube ich nicht hier?????
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
  console.log({ login });
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
