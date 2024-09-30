import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Fallback from './components/Fallback';
import Landingpage from './routes/Landingpage';
import Login from './routes/Login';
import Register from './routes/Register';
import DashboardProtector from './routes/protected/DashboardProtector';
import AdminDashboard from './routes/protected/AdminDasboard';
import FilesProtector from './routes/protected/Files';
import Files from './routes/protected/Files';

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landingpage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route element={<DashboardProtector />}>
              <Route path='/admin' element={<AdminDashboard />} />
            </Route>
            <Route element={<FilesProtector />}>
              <Route path='/files' element={<Files />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;
