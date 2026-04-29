import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './features/LandingPage';
import { LoginPage } from './features/Login';
import { RegisterPage } from './features/Register';
import { ForgotPasswordPage } from './features/ForgotPassword';
import { ErrorPage } from './features/ErrorPage';
import { ResetPasswordPage } from './features/ResetPassword';
import { DashboardLayout, ProtectedRoute } from '@/components/layouts';
import { DashboardPage } from './features/Dashboard';
import { GeneratePage } from './features/Generate';
import SalesPageDetailPage from './features/SalesPageDetail/page';

const Dashboard = () => <div className="p-8"><h1>Dashboard (Private)</h1></div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
    {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [ 
          { path: '/dashboard',      element: <DashboardPage/>  },
          { path: '/generate',       element: <GeneratePage/>},
          { path: '/sales-page/:id', element: <SalesPageDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage/>,
  },
]);