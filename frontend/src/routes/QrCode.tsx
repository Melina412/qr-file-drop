import VerifyCode from '../components/VerifyCode';

function QrCode() {
  return (
    <>
      <main className='text-center m-auto'>
        <h1 className='text-3xl m-5'>Verify QR code</h1>
        <h2 className='text-xl m-5'>hi, xxx wants to share files with you. enter your code to continue!</h2>
        <VerifyCode />
      </main>
    </>
  );
}

export default QrCode;
