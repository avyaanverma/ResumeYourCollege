import { Outlet } from 'react-router-dom';
import Navbar from '../../features/dashboard/components/Navbar';

export default function AppLayout() {
  return <>
      <Navbar/>
      <Outlet/>
    </>;
}
