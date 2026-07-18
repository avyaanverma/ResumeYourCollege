import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearSession } from '../../auth/authSlice';
import { logout } from '../../auth/authApi';

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'there';

  async function handleLogout() {
    try { await logout(); } finally { dispatch(clearSession()); navigate('/login'); }
  }

  return <main className="dashboard">
    <header className="dashboard-header"><span className="brand">ResumeYour<span>College</span></span><button className="text-button" onClick={handleLogout}>Log out</button></header>
    <section className="dashboard-content">
      <p className="eyebrow">DASHBOARD</p>
      <h1>Welcome, {firstName}.</h1>
      <p>Your account is ready. Your resume workspace will live here.</p>
      <div className="empty-state"><span className="empty-icon">+</span><h2>Create your first resume</h2><p>Start with your education, experience, and skills. You can refine every detail later.</p><button className="primary-button">Create resume</button></div>
    </section>
  </main>
}
