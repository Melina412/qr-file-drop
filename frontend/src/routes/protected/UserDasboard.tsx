import FileUpload from '../../components/FileUpload';
import GenerateCode from '../../components/GenerateCode';
import Logout from '../../components/Logout';
import type { DashboardProps, ResponseType } from '../../types';
import { useState, useEffect } from 'react';
import authFetch from '../../utils/authFetch';

function UserDashboard({ setLogin }: DashboardProps) {
  const [getFilesResponse, setGetFilesResponse] = useState<ResponseType>(null);
  const [uploadFileResponse, setUploadFileResponse] = useState<ResponseType>(null);
  const [deleteFileResponse, setDeleteFileResponse] = useState<ResponseType>(null);
  const [deleteFolderResponse, setDeleteFolderResponse] = useState<ResponseType>(null);

  useEffect(() => {
    async function getUserFiles() {
      try {
        const res = await authFetch(`${import.meta.env.VITE_BACKENDURL}/api/user/files`, {
          method: 'GET',
          credentials: 'include',
        });

        const response = await res.json();
        setGetFilesResponse(response);
      } catch (error) {
        console.error(error);
      }
    }
    getUserFiles();
  }, [uploadFileResponse, deleteFileResponse, deleteFolderResponse]);

  // console.log({ uploadFileResponse });
  // console.log({ getFilesResponse });
  // console.log({ deleteFileResponse });
  // console.log({ deleteFolderResponse });

  return (
    <>
      <header className='flex flex-row justify-between items-center gap-4 mx-5 my-5'>
        <p className='text-3xl'>User Dashboard</p>
        <div>
          <Logout setLogin={setLogin} />
        </div>
      </header>
      <main>
        <GenerateCode getFilesResponse={getFilesResponse} />
        <FileUpload
          setUploadFileResponse={setUploadFileResponse}
          setDeleteFileResponse={setDeleteFileResponse}
          setDeleteFolderResponse={setDeleteFolderResponse}
          getFilesResponse={getFilesResponse}
          uploadFileResponse={uploadFileResponse}
        />
      </main>
    </>
  );
}

export default UserDashboard;
