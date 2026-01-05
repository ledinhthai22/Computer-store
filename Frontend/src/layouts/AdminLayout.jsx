import { Outlet } from 'react-router-dom';
import NavBar from '../components/admin/navBar';
import Sidebar from '../components/admin/sideBar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen w-full relative bg-gray-50">
      <div className="min-h-screen font-sans relative z-10"> 
        <NavBar />
        <div className="flex">
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg overflow-y-auto z-40">
            <Sidebar />
          </div>
          
          <main className="flex-1 ml-64 pt-20 p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet /> 
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;