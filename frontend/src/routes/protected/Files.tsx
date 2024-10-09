import { useState, useEffect } from 'react';
import type { File, ResponseType } from '../../types';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

function Files() {
  const [response, setResponse] = useState<ResponseType>(null);
  const [file, setFile] = useState<File | null>(null);
  console.log({ file });
  console.log({ response });

  async function getFile() {
    const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode/file`, {
      method: 'GET',
      credentials: 'include',
    });
    const response = await res.json();

    setResponse(response);
    setFile(response.data.files[0]);
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
            <li>
              <Link
                to={`${file?.fileURL}?attachment=false`}
                target='_blank'
                download='CV.pdf'
                className='link link-accent link-hover'>
                CV.pdf
              </Link>
            </li>
          </ul>

          <p>
            or send them via email to <span className='text-accent'>{response?.data.email}</span>{' '}
          </p>
          <button className='btn btn-accent btn-outline' onClick={() => sendFile()}>
            Send Email
          </button>
        </div>
      </main>
    </>
  );
}

export default Files;
