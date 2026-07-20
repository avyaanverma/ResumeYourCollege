import { useState } from "react";
import "./styles/CreateResumeCard.css";

export default function CreateResumeCard({ onCreateResume, loading }) {
  const [resumeName, setResumeName] = useState("");

  function handleSubmit() {
    const name = resumeName.trim();

    if (!name) return;

    onCreateResume(name);
  }

  return (
    <section className="resume-card">
      <div>
        <p className="resume-card-tag">Resume Workspace</p>

        <h2>Create a new resume</h2>

        <p>Give your resume a meaningful name. You can always edit it later.</p>

        <input
          className="resume-name-input"
          type="text"
          placeholder="e.g. SDE Resume, Google Internship, Placement Resume"
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </div>

      <button
        className="create-button"
        disabled={loading || !resumeName.trim()}
        onClick={handleSubmit}
      >
        {loading ? "Creating..." : "Create Resume →"}
      </button>
    </section>
  );
}
