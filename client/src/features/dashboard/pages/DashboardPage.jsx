import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import HeroSection from "../components/HeroSection";
import CreateResumeCard from "../components/CreateResumeCard";
import Navbar from "../components/Navbar";
import {
  createResume,
  deleteResume,
  downloadResumePdf,
  getResumes,
} from "../../resume/resumeApi";
import "./styles/DashboardPage.css";

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getResumes()
      .then(setResumes)
      .catch(() => toast.error("Could not load your resumes"));
  }, []);
  async function handleCreateResume(title) {
    try {
      setLoading(true);
      const resume = await createResume({ title });
      toast.success("Resume created successfully!");
      navigate(`/resume/${resume._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create resume");
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(resumeId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(resumeId);

      await deleteResume(resumeId);

      setResumes((prev) => prev.filter((resume) => resume._id !== resumeId));

      toast.success("Resume deleted");
    } catch {
      toast.error("Unable to delete resume");
    } finally {
      setDeletingId(null);
    }
  }
  async function handleDownload(resume) {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      setDownloadingId(resume._id);

      const response = await downloadResumePdf(resume._id);

      const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      const name = resume.personal?.fullName || resume.title || "resume";
      link.download = `${name.replace(/[^a-z0-9 _-]/gi, "").trim().replace(/\s+/g, "-")}-resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to download this resume");
    } finally {
      setIsDownloading(false);
      setDownloadingId(null);
    }
  }
  return (
    <main className="dashboard">
      <section className="dashboard-container">
        <HeroSection firstName={user?.firstName} />
        <CreateResumeCard
          onCreateResume={handleCreateResume}
          loading={loading}
        />
        <section className="ai-resume-card">
          <div>
            <p className="resume-card-tag">AI-powered drafting</p>
            <h2>Create your resume using AI</h2>
            <p>Describe your real experience and get an editable first draft with a live PDF preview.</p>
          </div>
          <button className="create-button" onClick={() => navigate("/ai-resume")}>
            Start with AI →
          </button>
        </section>
        {resumes.length > 0 && (
          <section className="resume-list">
            <h2>Your resumes</h2>
            {resumes.map((resume) => (
              <article className="resume-item" key={resume._id}>
                <div>
                  <strong>{resume.title}</strong>
                  <p>
                    Last updated{" "}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <button
                    className="danger-button"
                    disabled={deletingId === resume._id}
                    onClick={() => handleDelete(resume._id)}
                  >
                    {deletingId === resume._id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => navigate(`/resume/${resume._id}`)}
                  >
                    Continue
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => navigate(`/resume/${resume._id}/preview`)}
                  >
                    Preview
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => handleDownload(resume)}
                    disabled={downloadingId === resume._id}
                  >
                    {downloadingId === resume._id ? (
                      <>
                        Generating PDF
                        <span className="spinner"></span>
                      </>
                    ) : (
                      "Download PDF"
                    )}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
