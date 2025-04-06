import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function DashboardProtector() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // console.log({ authorized }, { loading });

  //$ refreshToken() ---------------------------------------------------

  async function refreshToken() {
    try {
      // console.log('attempting to refresh token...');
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/refresh`, {
        credentials: 'include',
      });
      if (response.ok) {
        // console.log('✅ token refreshed successfully!');
        setAuthorized(true);
      } else {
        // console.log('❌ refresh failed:', response.statusText);
        setAuthorized(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('error in checkToken', error);
    }
  }

  //$ checkToken() ----------------------------------------------------

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/protector`, {
          credentials: 'include',
        });

        if (!response.ok) {
          // console.log('access token check failed, trying to refresh...');
          await refreshToken();
        } else {
          const exp = await response.json();
          const now = Date.now();
          const expDate = exp * 1000;
          // console.log(new Date(now).toLocaleString('de-DE'));
          // console.log(new Date(expDate).toLocaleString('de-DE'));

          if (exp && expDate < now) {
            // console.log('access token expired, refreshing...');
            setLoading(true);
            await refreshToken();
          } else {
            // console.log('access token is valid');
            setAuthorized(true);
          }
        }
      } catch (error) {
        console.error('error in checkToken', error);
        setAuthorized(false);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  if (!authorized && !loading) {
    return <Navigate to={'/login'} />;
  }
  if (loading) {
    return (
      <main>
        <div>
          <span className='loading loading-spinner text-secondary'></span>
        </div>
      </main>
    );
  }

  return <Outlet />;
}

export default DashboardProtector;
