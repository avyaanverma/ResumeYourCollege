import { createBrowserRouter, redirect } from "react-router";
import { store } from "./store";
import { getCurrentUser } from "../features/auth/authApi";
import { setSession } from "../features/auth/authSlice";
import AppLayout from "../shared/layouts/AppLayout";
import AuthLayout from "../shared/layouts/AuthLayout";
import LoginPage, { loginAction } from "../features/auth/pages/LoginPage";
import RegisterPage, {
  registerAction,
} from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NotFoundPage from "../shared/pages/NotFoundPage";
import HomePage from "../shared/pages/HomePage";
import TermsPage from "../shared/pages/TermsPage";
import PrivacyPage from "../shared/pages/PrivacyPage";
import ResumeWizardPage from "../features/resume/pages/ResumeWizardPage";
import ResumeLayout from "../features/resume/layout/ResumeLayout";
import Profile from "../features/resume/pages/Profile/Profile";
import Education from "../features/resume/pages/Education/Education";
import Experience from "../features/resume/pages/Experience/Experience";
import Projects from "../features/resume/pages/Projects/Projects";
import Skills from "../features/resume/pages/Skills/Skills";
import Review from "../features/resume/pages/Review/Review";
import AIPromptPage from "../features/resume/pages/AIPromptPage";
import Achievements from "../features/resume/pages/Achievements/Achievements";
import Certifications from "../features/resume/pages/Certifications/Certifications";
import Languages from "../features/resume/pages/Languages/Languages";
import { toast } from "react-toastify";

async function requireUser() {
  try {
    const user = await getCurrentUser();
    store.dispatch(setSession({ user }));
    return user;
  } catch (e) {
    console.error(e);
    console.error(e.response?.data);

    toast.error(e.response?.data?.message || "Authentication failed");

    store.dispatch(setSession({ user: null }));

    throw redirect("/login");
  }
}

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "dashboard", loader: requireUser, element: <DashboardPage /> },
      { path: "ai-resume", loader: requireUser, element: <AIPromptPage /> },
      {
        path: "resume/:resumeId",
        loader: requireUser,
        element: <ResumeLayout />,
        children: [
          {
            index: true,
            element: <Profile />,
          },

          {
            path: "profile",
            element: <Profile />,
          },

          {
            path: "education",
            element: <Education />,
          },

          {
            path: "experience",
            element: <Experience />,
          },

          {
            path: "projects",
            element: <Projects />,
          },

          {
            path: "skills",
            element: <Skills />,
          },
          {
            path: "achievements",
            element: <Achievements />,
          },
          {
            path: "certifications",
            element: <Certifications />,
          },
          {
            path: "languages",
            element: <Languages />,
          },
          {
            path: "review",
            element: <Review />,
          },
          {
            path: "preview",
            element: <Review />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", action: loginAction, element: <LoginPage /> },
      { path: "register", action: registerAction, element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
