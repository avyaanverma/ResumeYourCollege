import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearSession } from "../../auth/authSlice";
import HeroSection from "../components/HeroSection";
import CreateResumeCard from "../components/CreateResumeCard";
import Navbar from "../components/Navbar";
import { createResume, downloadResumePdf, getResumes } from "../../resume/resumeApi";
import "./styles/DashboardPage.css";

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { getResumes().then(setResumes).catch(() => toast.error("Could not load your resumes")); }, []);
  async function handleCreateResume() {
    try { setLoading(true); const resume = await createResume(); toast.success("Resume created successfully!"); navigate(`/resume/${resume._id}`); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed to create resume"); }
    finally { setLoading(false); }
  }
  async function handleDownload(resume) {
    try { const response = await downloadResumePdf(resume._id); const url = URL.createObjectURL(response.data); const link = document.createElement("a"); link.href = url; link.download = `${resume.personal?.fullName || resume.title || "resume"}-resume.pdf`; link.click(); URL.revokeObjectURL(url); }
    catch { toast.error("Unable to download this resume"); }
  }
  return <main className="dashboard"><section className="dashboard-container"><HeroSection firstName={user?.firstName} /><CreateResumeCard onCreateResume={handleCreateResume} loading={loading} />
    {resumes.length > 0 && <section className="resume-list"><h2>Your resumes</h2>{resumes.map((resume) => <article className="resume-item" key={resume._id}><div><strong>{resume.title}</strong><p>Last updated {new Date(resume.updatedAt).toLocaleDateString()}</p></div><div><button className="secondary-button" onClick={() => navigate(`/resume/${resume._id}`)}>Continue</button><button className="secondary-button" onClick={() => handleDownload(resume)}>Download PDF</button></div></article>)}</section>}
  </section></main>;
}
