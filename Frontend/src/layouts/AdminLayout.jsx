const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
         Sidebar
      </div>
      <main className="flex-1 ml-64 p-8"> 
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;