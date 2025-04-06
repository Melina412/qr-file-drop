import { useParams } from 'react-router-dom';
import { useState } from 'react';
import VerifyCode from '../components/VerifyCode';
import VerifyEmail from '../components/VerifyEmail';
import VerifyPin from '../components/VerifyPin';

import type { ResponseType } from '../types';
import Header from '../components/Header';

function QrCode() {
  const params = useParams();
  let slug = params.id;

  const [response, setResponse] = useState<ResponseType>(null);

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  // console.log({ verified }, { loading }, { emailSent });

  return (
    <>
      <Header />
      <main className='text-center m-auto'>
        {loading && (
          <VerifyCode
            verified={verified}
            setVerified={setVerified}
            setLoading={setLoading}
            response={response}
            setResponse={setResponse}
            slug={slug}
          />
        )}

        {!emailSent && !loading && verified && (
          <VerifyEmail setEmailSent={setEmailSent} response={response} setResponse={setResponse} slug={slug} />
        )}
        {emailSent && !loading && verified && <VerifyPin slug={slug} />}
      </main>
    </>
  );
}

export default QrCode;
