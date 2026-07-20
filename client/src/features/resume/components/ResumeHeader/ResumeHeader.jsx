import { useNavigate } from "react-router-dom";
import "./ResumeHeader.css";

export default function ResumeHeader() {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="resume-header">
      <h2>Let's Build Your Resume</h2>
      
      <div className="header-actions">
        <button className="save-btn">Save Draft</button>
        
        <button className="dashboard-btn" onClick={handleDashboardClick}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="btn-icon"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </button>
      </div>
    </header>
  );
}   