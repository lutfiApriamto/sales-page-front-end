import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './features/LandingPage';
import { LoginPage } from './features/Login';
import { RegisterPage } from './features/Register';
import { ForgotPasswordPage } from './features/ForgotPassword';
import { ErrorPage } from './features/ErrorPage';
import { ResetPasswordPage } from './features/ResetPassword';

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
    path: '/dashboard',
    element: <Dashboard />,
  },

  {
    path: '*',
    element: <ErrorPage/>,
  },
]);