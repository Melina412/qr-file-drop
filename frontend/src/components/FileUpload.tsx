import { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { ResponseType } from '../types';
import { Link } from 'react-router-dom';

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileResponse, setFileResponse] = useState<ResponseType>(null);
  console.log({ fileResponse });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  async function uploadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData();
    console.log(form);
    // console.log({ form });

    if (file) {
      form.append('file', file);
      form.append('fileName', fileName);
      const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/user/file/upload`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const response = await res.json();

      setFileResponse(response);
      if (res.ok) {
        console.log(response.message);
      } else {
        console.error(response.message);
      }
    }
  }
  return (
    <>
      <section className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
        <form onSubmit={uploadFile} className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
          <div className='m-auto'>
            <label htmlFor='file' id='file-label'>
              Select file for upload
            </label>
            <input type='file' id='file' name='file' onChange={handleFileChange} />
            <label className='input input-bordered flex items-center gap-2'>
              File Name
              <input type='text' name='fileName' className='grow' onChange={(e) => setFileName(e.target.value)} />
            </label>{' '}
          </div>
          <div className='buttons flex gap-2'>
            <button type='button' className='btn btn-primary'>
              Cancel
            </button>
            <button type='submit' className='btn btn-accent'>
              Upload
            </button>
          </div>
        </form>
        <div>
          <p>file preview:</p>
          <Link to={`${fileResponse?.data.fileURL}?attachment=false`} target='_blank' className='link link-info'>
            download
          </Link>
          <button className='btn btn-outline' onClick={() => window.open(`${fileResponse?.data.fileURL}`, '_blank')}>
            preview
          </button>
        </div>
      </section>
    </>
  );
}

export default FileUpload;
