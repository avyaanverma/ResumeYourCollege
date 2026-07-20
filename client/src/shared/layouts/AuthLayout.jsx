import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <Link className="brand" to="/">
          ResumeYour<span>College</span>
        </Link>
        <div>
          <p className="eyebrow">YOUR CAREER, CLEARLY PRESENTED</p>
          <h1>Build a resume that opens doors.</h1>
          <p className="intro-copy">
            Create focused, professional resumes and keep your next opportunity
            within reach.
          </p>
        </div>
        <p className="intro-footer">
          Designed for students and early-career professionals.
        </p>
      </section>
      <section className="auth-panel">
        <Outlet />
      </section>
    </main>
  );
}
