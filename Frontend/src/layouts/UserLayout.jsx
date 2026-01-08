import Header from "../components/user/ui/Header";
import NavBar from "../components/user/ui/NavBar";
import Footer from "../components/user/ui/Footer";
import { ToastProvider } from "../contexts/ToastContext";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <NavBar />
        <div className="flex-1 bg-gray-200">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ToastProvider>
  );
}