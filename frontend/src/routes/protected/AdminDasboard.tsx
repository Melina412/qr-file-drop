import GenerateCode from '../../components/GenerateCode';
import Logout from '../../components/Logout';
import type { DashboardProps } from '../../types';
function AdminDashboard({ setLogin }: DashboardProps) {
  return (
    <>
      <h1>AdminDashboard</h1>
      <GenerateCode />
      <Logout setLogin={setLogin} />
    </>
  );
}

export default AdminDashboard;
