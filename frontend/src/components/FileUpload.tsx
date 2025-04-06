import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { FileType, FileUploadProps } from '../types';
import { Link } from 'react-router-dom';
import authFetch from '../utils/authFetch';

function FileUpload({
  setUploadFileResponse,
  setDeleteFileResponse,
  setDeleteFolderResponse,
  getFilesResponse,
  uploadFileResponse,
}: FileUploadProps) {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      console.log(e.target.files);
      console.log(e.target.files[0]);
      console.log(e.target);
    }

    if (e.target.files !== null) setInputFile(e.target.files[0]);
  };

  async function uploadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData();
    console.log(form);
    // console.log({ form });

    if (inputFile) {
      form.append('file', inputFile);
      form.append('fileName', fileName);
      try {
        const res = await authFetch(`${import.meta.env.VITE_BACKENDURL}/api/user/file`, {
          method: 'POST',
          credentials: 'include',
          body: form,
        });
        const response = await res.json();
        setUploadFileResponse(response);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function deleteFile(file: FileType) {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKENDURL}/api/user/file`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(file),
      });
      const response = await res.json();
      setDeleteFileResponse(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteAllFiles() {
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKENDURL}/api/user/folder`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await res.json();
      setDeleteFolderResponse(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <section className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
        <h2>My Files</h2>
        <div>
          <button className='btn btn-error' onClick={() => deleteAllFiles()}>
            Delete all files
          </button>
        </div>
        {getFilesResponse?.data.length === 0 && <p>- no files available -</p>}
        <div>
          <ul>
            {getFilesResponse?.data.map((file: FileType) => (
              <li
                key={file._id}
                className='grid grid-cols-[3fr_1fr] items-center gap-2 mb-2'
                style={{ gridTemplateColumns: '3fr 1fr' }}>
                <div>
                  <p>
                    {file.fileName}
                    {!file.fileName.endsWith(`.${file.format}`) && `.${file.format}`}
                  </p>
                </div>
                {/* DELETE BUTTON */}
                <div>
                  <button className='btn btn-square btn-outline btn-secondary' onClick={() => deleteFile(file)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={uploadFile} className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
          <div className='m-auto gap-2'>
            <h2 className='text-2xl mb-5'>File Upload</h2>
            <input
              type='file'
              id='file'
              name='file'
              onChange={handleFileChange}
              className='file-input file-input-bordered file-input-accent w-full max-w-xs mb-3'
            />
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
        <div className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
          <h2 className='text-2xl mb-5'>File Preview</h2>
          <div className='buttons flex gap-2 justify-center items-center'>
            <Link
              to={`${uploadFileResponse?.data.fileURL}?attachment=false`}
              target='_blank'
              className='link link-info'>
              download
            </Link>
            <button
              className='btn btn-outline'
              onClick={() => window.open(`${uploadFileResponse?.data.fileURL}`, '_blank')}>
              preview
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default FileUpload;
