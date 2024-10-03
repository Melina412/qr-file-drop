import type { LogoutProps } from '../types';
function Logout({ setLogin }: LogoutProps) {
  async function userLogout() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        setLogin(false);
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
        <button onClick={() => userLogout()}>Logout</button>
      </div>
    </>
  );
}

export default Logout;
