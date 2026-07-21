import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { downloadResumePdf } from "../../resumeApi";
import "./Review.css"
import { useState } from "react";
export default function Review() {
  const [isGenerating, setIsGenerating] = useState(false);
  const resume = useSelector((s) => s.resume.current);
  const { resumeId } = useParams();
  const navigate = useNavigate();
  async function generate() {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const response = await downloadResumePdf(resumeId);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume?.personal?.fullName || resume?.title || "resume"}-resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Your resume PDF is ready");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not generate the PDF");
    } finally {
        setIsGenerating(false);
    }
  }
  if (!resume) return <p>Loading resume…</p>;
  return (
    <section className="form-page">
      {isGenerating && (
        <div className="pdf-loading-overlay">
            <div className="pdf-loading-card">
            <div className="spinner"></div>

            <h2>Generating your resume...</h2>

            <p>
                We're compiling your LaTeX template and creating your PDF.
                This usually takes a few seconds.
            </p>
            </div>
        </div>
        )}
      <h1>Review your resume</h1>
      <p>Check each section before generating your PDF.</p>
      <div className="review-card">
        <h2>{resume.personal?.fullName || "Your name"}</h2>
        <p>
          {resume.personal?.email}{" "}
          {resume.personal?.phone && `• ${resume.personal.phone}`}
        </p>
        <p>{resume.summary}</p>
        {[
          "education",
          "experience",
          "projects",
          "skills",
          "certifications",
          "achievements",
          "languages",
        ].map((key) => (
          <p key={key}>
            <strong>{key[0].toUpperCase() + key.slice(1)}:</strong>{" "}
            {resume[key]?.length || 0} item(s){" "}
            <button
              className="text-button"
              onClick={() => navigate(`../${key}`)}
            >
              Edit
            </button>
          </p>
        ))}
      </div>
      <button
        className="primary-button"
        onClick={generate}
        disabled={isGenerating}
        >
        {isGenerating
            ? "Generating PDF..."
            : "Generate & Download PDF"}
      </button>
    </section>
  );
}
