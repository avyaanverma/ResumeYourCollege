import { useDispatch } from "react-redux";
import "./styles/Navbar.css";
import { clearSession } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await onLogout();
    } finally {
      dispatch(clearSession());
      navigate("/login");
    }
  }
  return (
    <header className="dashboard-header">
      <div className="dashboard-logo">
        ResumeYour
        <span>College!!</span>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
