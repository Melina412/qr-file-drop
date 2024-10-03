import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useState } from 'react';

import Fallback from './components/Fallback';
import Landingpage from './routes/Landingpage';
import Login from './routes/Login';
import Register from './routes/Register';
import DashboardProtector from './routes/protected/DashboardProtector';
import AdminDashboard from './routes/protected/AdminDasboard';
import FilesProtector from './routes/protected/FilesProtector';
import Files from './routes/protected/Files';
import QrCode from './routes/QrCode';

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
              <Route path='/admin' element={<AdminDashboard />} />
            </Route>
            <Route element={<FilesProtector />}>
              <Route path='/files/:id' element={<Files />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;
