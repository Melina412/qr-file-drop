import { useState } from 'react';
import type { QrCodeData } from '../types';
import { Link } from 'react-router-dom';

function GenerateCode() {
  const [data, setData] = useState<QrCodeData>(null);
  console.log({ data });

  async function generateQrCOde() {
    const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: 1, pincode: true, expiresIn: 60 }),
      credentials: 'include',
    });

    const response = await res.json();
    if (res.ok) {
      setData(response.data);
    }
  }

  return (
    <>
      <section>
        <div className='flex flex-col justify-center items-center gap-4 mx-5 my-10'>
          <button className='btn btn-outline' onClick={() => generateQrCOde()}>
            Generate QR-Code
          </button>
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
