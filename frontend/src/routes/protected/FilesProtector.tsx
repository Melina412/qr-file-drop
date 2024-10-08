import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

function FilesProtector() {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/auth/protector/files`, {
          credentials: 'include',
        });
        if (response.ok) {
          setVerified(true);
        }
      } catch (error) {
        console.error('error in checkToken', error);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  if (!verified && !loading) {
    return <Navigate to={`/not-verified`} />;
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

export default FilesProtector;
