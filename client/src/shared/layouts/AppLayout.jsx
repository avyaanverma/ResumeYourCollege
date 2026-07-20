import { Outlet } from 'react-router';
import Navbar from '../../features/dashboard/components/Navbar';

export default function AppLayout() {
  return <>
      <Navbar/>
      <Outlet/>
    </>;
}
