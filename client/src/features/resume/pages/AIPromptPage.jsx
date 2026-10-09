import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getApiError } from "../../../shared/api/http";
import { generateResumeFromPrompt } from "../resumeApi";
import "./AIPromptPage.css";

const examples = [
  "Create my resume",
  "Create my SDE resume",
  "Create my Data Science resume",
];

export default function AIPromptPage() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const sample = examples[sampleIndex];

  useEffect(() => {
    let delay = deleting ? 35 : 75;
    if (!deleting && characterIndex === sample.length) delay = 1100;

    const timer = setTimeout(() => {
      if (!deleting && characterIndex < sample.length) {
        setCharacterIndex((index) => index + 1);
      } else if (!deleting) {
        setDeleting(true);
      } else if (characterIndex > 0) {
        setCharacterIndex((index) => index - 1);
      } else {
        setDeleting(false);
        setSampleIndex((index) => (index + 1) % examples.length);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [characterIndex, deleting, sample.length]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setGenerating(true);
    try {
      const resume = await generateResumeFromPrompt(prompt);
      toast.success("Your AI resume is ready to review");
      navigate(`/resume/${resume._id}/preview`);
    } catch (requestError) {
      const message = getApiError(requestError)[0]?.message || "Could not generate your resume";
      setError(message);
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="ai-prompt-page">
      <section className="ai-prompt-card">
        <p className="eyebrow">AI RESUME BUILDER</p>
        <h1>
          Your experience, shaped into a <span>resume that gets noticed.</span>
        </h1>
        <div className="ai-typing-example" aria-hidden="true">
          <span>{sample.slice(0, characterIndex)}</span>
          <i />
        </div>
        <p className="ai-prompt-intro">
          Describe your target role and share real details about your work, education, projects, and skills.
          Grok won’t invent missing experience or credentials.
        </p>
        <form onSubmit={submit} className="ai-prompt-form">
          <label htmlFor="resume-prompt">What should your resume highlight?</label>
          <textarea
            id="resume-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Create my SDE resume. I’m a final-year CS student with a backend internship, a campus event app project using React and Node, and skills in Java, SQL, and AWS. My full name is …"
            maxLength={3000}
            minLength={20}
            required
          />
          <div className="ai-prompt-meta">
            <span>Include only accurate facts; you can edit the generated resume next.</span>
            <span>{prompt.length}/3000</span>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={generating || prompt.trim().length < 20}>
            {generating ? "Creating your resume..." : "Generate resume →"}
          </button>
        </form>
      </section>
    </main>
  );
}
