import Header from '../components/Header';
import { NavLink, Link } from 'react-router-dom';

function Landingpage() {
  return (
    <>
      <Header />
      <main>
        <nav className='flex flex-row justify-between items-center gap-4 px-10 py-5 m-auto'>
          <NavLink to='/login' className='link link-primary'>
            Login
          </NavLink>
          <NavLink to='/register' className='link link-primary'>
            Register
          </NavLink>
          <NavLink to='/user' className='link link-primary'>
            User Dashboard
          </NavLink>
        </nav>
      </main>
      <footer className='footer footer-center flex flex-row justify-center items-center position absolute bottom-0 w-full p-5'>
        <p>Project Info on</p>

        <Link to='https://github.com/Melina412/qr-file-drop' className='link link-info'>
          GitHub
        </Link>
      </footer>
    </>
  );
}

export default Landingpage;
