import { useState } from 'react';
import type { QrCodeData } from '../types';

function GenerateCode() {
  //   const [qrCode, setQrCode] = useState('');
  const [data, setData] = useState<QrCodeData>(null);

  async function generateQrCOde() {
    const res = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/qrcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: 1, secure: true, expiresIn: 1 }),
      credentials: 'include',
    });

    const response = await res.json();
    if (res.ok) {
      //   setQrCode(response.dataURL);
      setData(response.data);
    }
  }

  //   console.log({ qrCode });
  console.log({ data });

  return (
    <>
      <div>
        <button className='btn btn-outline' onClick={() => generateQrCOde()}>
          Generate QR-Code
        </button>
      </div>
      {data && (
        <div className='m-10' id='container'>
          <img src={data?.dataURL} alt='qr-code' />
          <p>
            expires at: <span>{data && new Date(data.expiresAt).toLocaleString()}</span>
          </p>
        </div>
      )}
    </>
  );
}

export default GenerateCode;
