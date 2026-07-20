import "./styles/Navbar.css";

export default function Navbar({ onLogout }) {
    async function handleLogout() {
        try {
            await logout();
        } finally {
            dispatch(clearSession());
            navigate("/login");
        }
    }
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