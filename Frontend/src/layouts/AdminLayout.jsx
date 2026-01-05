import NavBar from "../components/admin/navBar";
import Sidebar from "../components/admin/SideBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />
      <div className="flex">
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg overflow-y-auto z-40">
           <Sidebar />
        </div>
        <main className="flex-1 ml-64 pt-20 p-8"> 
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;