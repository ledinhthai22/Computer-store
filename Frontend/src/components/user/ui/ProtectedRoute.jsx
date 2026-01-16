import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";
import { useModalLogin } from "../../../contexts/ModalLoginContext";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const {openLogin} = useModalLogin();
  useEffect(() => {
    if (!user) {
      openLogin();
    }
  }, [user, openLogin]);
  if (!user) {
    return <Navigate to="/" replace/>; 
  }

  if (user.vaiTro !== "QuanTriVien") {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
}