import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearSession } from "../../auth/authSlice";
import { logout } from "../../auth/authApi";

import DashboardHeader from "../components/DashboardHeader";
import HeroSection from "../components/HeroSection";
import CreateResumeCard from "../components/CreateResumeCard";

import "./styles/DashboardPage.css";

export default function DashboardPage() {

    const user = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } finally {
            dispatch(clearSession());
            navigate("/login");
        }
    }

    return (

        <main className="dashboard">

            <DashboardHeader
                onLogout={handleLogout}
            />

            <section className="dashboard-container">

                <HeroSection
                    firstName={user?.firstName}
                />

                <CreateResumeCard />

            </section>

        </main>

    );

}