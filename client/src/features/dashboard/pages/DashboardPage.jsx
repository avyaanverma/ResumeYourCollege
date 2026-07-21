import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearSession } from "../../auth/authSlice";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getResumes()
      .then(setResumes)
      .catch(() => toast.error("Could not load your resumes"));
  }, []);
  async function handleCreateResume() {
    try {
      setLoading(true);
      const resume = await createResume();
      toast.success("Resume created successfully!");
      navigate(`/resume/${resume._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create resume");
    } finally {
      setLoading(false);
    }
  }
  async function handleDownload(resume) {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadingId(resume._id);

      const response = await downloadResumePdf(resume._id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        resume.personal?.fullName || resume.title || "resume"
      }-resume.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      // Delay revoking so the browser has time to start the download
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Unable to download this resume");
    } finally {
      setIsDownloading(false);
      setDownloadingId(null);
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
    try {
      setDownloadingId(resume._id);

      const response = await downloadResumePdf(resume._id);

      const url = URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${resume.title}.pdf`;

      link.click();

      URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to download");
    } finally {
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
