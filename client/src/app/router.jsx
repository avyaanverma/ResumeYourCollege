import { createBrowserRouter, redirect } from 'react-router-dom';
import { store } from './store';
import { getCurrentUser } from '../features/auth/authApi';
import { setSession } from '../features/auth/authSlice';
import AppLayout from '../shared/layouts/AppLayout';
import AuthLayout from '../shared/layouts/AuthLayout';
import LoginPage, { loginAction } from '../features/auth/pages/LoginPage';
import RegisterPage, { registerAction } from '../features/auth/pages/RegisterPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import NotFoundPage from '../shared/pages/NotFoundPage';
import ResumeWizardPage from '../features/resume/pages/ResumeWizardPage';

async function requireUser() {
  try {
    const user = await getCurrentUser();
    store.dispatch(setSession({ user }));
    return user;
  } catch {
    store.dispatch(setSession({ user: null }));
    throw redirect('/login');
  }
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, loader: () => redirect('/login') },
      { path: 'dashboard', loader: requireUser, element: <DashboardPage /> },
      { path: 'resume/:id/wizard', element: <ResumeWizardPage/>}
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', action: loginAction, element: <LoginPage /> },
      { path: 'register', action: registerAction, element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
