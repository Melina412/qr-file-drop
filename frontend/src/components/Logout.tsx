import type { LogoutProps } from '../types';
import { useNavigate } from 'react-router-dom';
function Logout({ setLogin }: LogoutProps) {
  const navigate = useNavigate();
  async function userLogout() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        setLogin(false);
        navigate('/login');
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
        <button className='btn btn-outline mt-5' onClick={() => userLogout()}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Logout;
