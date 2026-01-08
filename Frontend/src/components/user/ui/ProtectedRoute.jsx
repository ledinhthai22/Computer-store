import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthProvider";

export default function ProtectedRoute() {
  const { user,logout } = useAuth();

  if (!user || user.vaiTro !== "QuanTriVien") {
    logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
