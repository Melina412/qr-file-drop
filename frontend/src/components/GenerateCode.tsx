import { useState, useEffect } from 'react';
import type { QrCodeData, GenerateCodeProps, FileType } from '../types';
import { Link } from 'react-router-dom';

function GenerateCode({ getFilesResponse }: GenerateCodeProps) {
  const [data, setData] = useState<QrCodeData>(null);
  console.log({ data });
  const [availableFiles, setAvailableFiles] = useState<FileType[]>(
    getFilesResponse ? getFilesResponse.data.map((file: FileType) => file) : []
  );
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);

  useEffect(() => {
    setAvailableFiles(getFilesResponse ? getFilesResponse.data.map((file: FileType) => file) : []);
  }, [getFilesResponse]);
  console.log({ availableFiles });
  console.log({ getFilesResponse });
  console.log({ selectedFile });
  console.log({ selectedDuration });

  async function generateQrCOde() {
    const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: selectedFile, count: 1, pincode: true, expiresIn: selectedDuration * 24 }),
      credentials: 'include',
    });

    const response = await res.json();
    if (res.ok) {
      setData(response.data);
    }
  }

  const handleModal = () => {
    return () => {
      const modal = document.getElementById('generate-qrcode') as HTMLDialogElement;
      modal?.showModal();
    };
  };

  const selectFile = (file: FileType) => {
    file && setSelectedFile(file);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDuration(parseInt(e.target.value));
  };

  return (
    <>
      <section className='mb-48'>
        <div className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
          <button className='btn btn-outline' onClick={handleModal()}>
            Generate QR-Code
          </button>
          <dialog id='generate-qrcode' className='modal'>
            <div className='modal-box'>
              <h3 className='font-bold text-lg text-left'>Generate QR Code</h3>
              <h4>validity duration</h4>
              <div>
                <input type='radio' name='duration' id='5m' value={5} className='radio' onChange={handleRadioChange} />
                <label htmlFor='5m'>5 min</label>
              </div>
              <div>
                <input type='radio' name='duration' id='1h' value={60} className='radio' onChange={handleRadioChange} />
                <label htmlFor='1h'>1 h</label>
              </div>
              <div>
                <input
                  type='radio'
                  name='duration'
                  id='6h'
                  value={6 * 60}
                  className='radio'
                  onChange={handleRadioChange}
                />
                <label htmlFor='6h'>6 h</label>
              </div>
              <div>
                <input
                  type='radio'
                  name='duration'
                  id='12h'
                  value={12 * 60}
                  className='radio'
                  onChange={handleRadioChange}
                />
                <label htmlFor='12h'>12 h</label>
              </div>
              <div>
                <input
                  type='radio'
                  name='duration'
                  id='24h'
                  value={24 * 60}
                  className='radio'
                  onChange={handleRadioChange}
                />
                <label htmlFor='24h'>24 h</label>
              </div>

              <h4 className='font-bold text-lg text-left'>Choose file</h4>
              <div>
                <ul>
                  {availableFiles.map((file: FileType) => (
                    <li key={file._id} onClick={() => selectFile(file)} className='cursor-pointer'>
                      {file.fileName}
                    </li>
                  ))}
                </ul>
              </div>

              <div className='modal-action'>
                <form method='dialog'>
                  {/* if there is a button in form, it will close the modal */}
                  <button className='btn btn-secondary' onClick={() => generateQrCOde()}>
                    Generate
                  </button>
                  <button className='btn ml-2'>Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
        {data && (
          <div className='flex flex-col justify-center items-center gap-2 mx-5 m-10' id='container'>
            <img src={data?.dataURL} alt='qr-code' className='' />
            <p>
              expires at: <span>{data && new Date(data.expiresAt).toLocaleString()}</span>
            </p>
            <p className='text-sm text-success'>
              <Link to={`/qr-code/${data?.slug}`}>view code scan</Link>
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default GenerateCode;
