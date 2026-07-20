import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearSession } from "../../auth/authSlice";
import { logout } from "../../auth/authApi";

import DashboardHeader from "../components/DashboardHeader";
import HeroSection from "../components/HeroSection";
import CreateResumeCard from "../components/CreateResumeCard";

import { useState } from "react";

import { createResume } from "../../resume/resumeApi";

import "./styles/DashboardPage.css";



export default function DashboardPage() {

    const user = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);

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
    async function handleCreateResume(){
      try{
        setLoading(true);

        const res = await createResume();

        navigate(`/resume/${res.data._id}/wizard`);
      } catch (err){
        console.log(err);
      } finally {
        setLoading(false);
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

                <CreateResumeCard 
                  onCreateResume={handleCreateResume}
                  loading={loading}
                />

            </section>

        </main>

    );

}