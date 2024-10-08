import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useState } from 'react';

import Fallback from './components/Fallback';
import Landingpage from './routes/Landingpage';
import Login from './routes/Login';
import Register from './routes/Register';
import DashboardProtector from './routes/protected/DashboardProtector';
import UserDashboard from './routes/protected/UserDasboard';
import FilesProtector from './routes/protected/FilesProtector';
import Files from './routes/protected/Files';
import QrCode from './routes/QrCode';
import NotFound from './routes/NotFound';

function App() {
  const [login, setLogin] = useState(false);
  console.log({ login });
  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landingpage />} />
            <Route path='/login' element={<Login setLogin={setLogin} />} />
            <Route path='/register' element={<Register />} />
            <Route path='/qr-code/:id' element={<QrCode />} />
            <Route element={<DashboardProtector />}>
              <Route path='/user' element={<UserDashboard setLogin={setLogin} />} />
            </Route>
            <Route element={<FilesProtector />}>
              <Route path='/files' element={<Files />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;
