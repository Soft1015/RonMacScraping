import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import DashboardAppPage from './pages/DashboardAppPage';

// ----------------------------------------------------------------------

export default function Router() {
  // const startsec = Math.floor(Date.now() / 1000.0);
  // setInterval(() => CheckTimeUpdation(), 1000);

  // const CheckTimeUpdation = () => {
  //   const currentsec = Date.now();
  //   var today = new Date();
  //   var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  //   var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // }

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
      ],
    }
  ]);

  return routes;
}
