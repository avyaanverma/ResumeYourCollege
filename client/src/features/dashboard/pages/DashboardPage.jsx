import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearSession } from "../../auth/authSlice";
import { logout } from "../../auth/authApi";

import HeroSection from "../components/HeroSection";
import CreateResumeCard from "../components/CreateResumeCard";

import { useState } from "react";

import { createResume } from "../../resume/resumeApi";

import "./styles/DashboardPage.css";

import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

export default function DashboardPage() {

    const user = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();


    async function handleCreateResume(){
      try{
        setLoading(true);

        // const res = await createResume();
        toast.success("Resume Created successfully!");
        navigate(`/resume/id/wizard`);
      } catch (err){
        toast.error(err?.response?.data?.message || "Failed to create resume. Please try again later");
      } finally {
        setTimeout(()=>setLoading(false), 200)
      }
    }
    return (

        <main className="dashboard">

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