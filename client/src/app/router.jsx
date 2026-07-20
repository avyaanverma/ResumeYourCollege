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
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NotFoundPage from "../shared/pages/NotFoundPage";
import ResumeWizardPage from "../features/resume/pages/ResumeWizardPage";
import ResumeLayout from "../features/resume/layout/ResumeLayout";
import Profile from "../features/resume/pages/Profile/Profile";
import Education from "../features/resume/pages/Education/Education";
import Experience from "../features/resume/pages/Experience/Experience";
import Projects from "../features/resume/pages/Projects/Projects";
import Skills from "../features/resume/pages/Skills/Skills";
import Review from "../features/resume/pages/Review/Review";
import Achievements from "../features/resume/pages/Achievements/Achievements";
import Certifications from "../features/resume/pages/Certifications/Certifications";
import Languages from "../features/resume/pages/Languages/Languages";

async function requireUser() {
  try {
    const user = await getCurrentUser();
    store.dispatch(setSession({ user }));
    return user;
  } catch {
    store.dispatch(setSession({ user: null }));
    throw redirect("/login");
  }
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, loader: () => redirect("/login") },
      { path: "dashboard", loader: requireUser, element: <DashboardPage /> },
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
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", action: loginAction, element: <LoginPage /> },
      { path: "register", action: registerAction, element: <RegisterPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
