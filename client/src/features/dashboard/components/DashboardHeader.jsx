import "./styles/DashboardHeader.css";

export default function DashboardHeader({ onLogout }) {

    return (

        <header className="dashboard-header">

            <div className="dashboard-logo">

                ResumeYour
                <span>College</span>

            </div>

            <button
                className="logout-button"
                onClick={onLogout}
            >
                Logout
            </button>

        </header>

    );

}