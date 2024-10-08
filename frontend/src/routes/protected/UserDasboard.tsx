import GenerateCode from '../../components/GenerateCode';
import Logout from '../../components/Logout';
import type { DashboardProps } from '../../types';
function UserDashboard({ setLogin }: DashboardProps) {
  return (
    <>
      <header className='flex flex-row justify-between items-center gap-4 mx-5 my-5'>
        <p className='text-3xl'>User Dashboard</p>
        <div>
          <Logout setLogin={setLogin} />
        </div>
      </header>
      <main>
        <GenerateCode />
      </main>
    </>
  );
}

export default UserDashboard;
