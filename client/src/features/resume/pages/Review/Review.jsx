import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { downloadResumePdf } from "../../resumeApi";
export default function Review() {
  const resume = useSelector((s) => s.resume.current);
  const { resumeId } = useParams();
  const navigate = useNavigate();
  async function generate() {
    try {
      const response = await downloadResumePdf(resumeId);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume?.personal?.fullName || resume?.title || "resume"}-resume.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Your resume PDF is ready");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not generate the PDF");
    }
  }
  if (!resume) return <p>Loading resume…</p>;
  return (
    <section className="form-page">
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
      <button className="primary-button" onClick={generate}>
        Generate & Download PDF
      </button>
    </section>
  );
}
