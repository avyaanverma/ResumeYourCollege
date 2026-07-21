import { Outlet } from "react-router";
import Navbar from "../../features/dashboard/components/Navbar";
import { logout } from "../../features/auth/authApi";

export default function AppLayout() {
  return (
    <>
      <Navbar onLogout={logout} />
      <Outlet />
    </>
  );
}
