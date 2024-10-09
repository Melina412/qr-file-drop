import { Link } from 'react-router-dom';
import Header from '../components/Header';
function NotFound() {
  return (
    <>
      <Header />
      <main>
        <div className='flex flex-col justify-center items-center m-10 gap-5'>
          <h1 className='text-3xl text-center mt-5'>404</h1>
          <h2 className='text-2xl text-center mb-5'>Not Found</h2>
          <div>
            <Link to='/' className='link link-info'>
              Go back Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default NotFound;
