import { useState, useEffect } from 'react';
import type { FileType, ResponseType } from '../../types';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

function Files() {
  const [fileResponse, setFileResponse] = useState<ResponseType>(null);
  const [mailResponse, setMailResponse] = useState<ResponseType>(null);
  const [files, setFiles] = useState<FileType[] | null>(null);
  console.log({ files });
  console.log({ fileResponse });
  console.log({ mailResponse });

  async function getFile() {
    const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode/file`, {
      method: 'GET',
      credentials: 'include',
    });
    const response = await res.json();

    setFileResponse(response);
    setFiles(response.data.files);
  }

  useEffect(() => {
    getFile();
  }, []);

  async function sendFile() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode/sendfile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();
      console.log(response);

      if (res.ok) {
        setMailResponse(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className='flex flex-col justify-center items-center mx-5 my-10 gap-5'>
          <h1>You can now download the files below</h1>
          <ul className='menu bg-base-200 rounded-box w-56 mb-10'>
            {files?.map((file) => (
              <li key={file?._id}>
                <Link
                  to={`${file?.fileURL}?attachment=false`}
                  target='_blank'
                  download='file'
                  className='link link-accent link-hover'>
                  {file?.fileName}.{file?.format}
                </Link>
                {/* download name muss ggf. im be festgelegt werden, sonst ist hier trotzdem die cloudinary id */}
              </li>
            ))}
          </ul>
          <div className='flex flex-col justify-center items-center'>
            {!mailResponse?.success === true ? (
              <div className='mb-5'>
                <p className='mb-3'>
                  or send them via email to <span className='text-accent'>{fileResponse?.data.email}</span>{' '}
                </p>
                <button className='btn btn-accent btn-outline' onClick={() => sendFile()}>
                  Send Email
                </button>
              </div>
            ) : (
              <div>
                <p>{mailResponse?.message}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Files;
