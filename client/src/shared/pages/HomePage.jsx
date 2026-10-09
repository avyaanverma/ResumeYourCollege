import { Link } from "react-router";

const workflow = [
  {
    title: "Create your profile",
    description:
      "Capture your personal details, summary, and strongest early-career story.",
  },
  {
    title: "Build each section",
    description:
      "Add education, projects, experience, skills, and achievements without losing flow.",
  },
  {
    title: "Review and export",
    description:
      "Check the final resume, download a polished PDF, and move toward interviews.",
  },
];

const features = [
  "ATS-friendly sections and clean structure",
  "Resume versioning for different opportunities",
  "Fast editing across education, projects, and experience",
  "PDF export ready for applications and recruiter review",
];

const templateHighlights = [
  { label: "Minimal", value: "Clean, readable layout" },
  { label: "Professional", value: "Strong structure for campus hiring" },
  { label: "Focused", value: "Built for early-career roles" },
];

const faq = [
  {
    question: "Do I need to pay to try it?",
    answer:
      "The product is designed to help students create and manage resumes with a straightforward, secure workflow.",
  },
  {
    question: "Can I update my resume later?",
    answer:
      "Yes. The resume builder is designed for iterative edits, revisions, and version management.",
  },
  {
    question: "What happens to my data?",
    answer:
      "Your account stores your resume data in your private workspace, and export/download actions are handled through the app flow.",
  },
];

export default function HomePage() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Link className="brand" to="/">
          Resume Your <span>College</span>
        </Link>

        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="landing-actions">
          <Link className="nav-link" to="/login">
            Sign in
          </Link>
          <Link className="primary-button" to="/register">
            Create account
          </Link>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-copy">
            <p className="eyebrow landing-eyebrow">BUILD YOUR NEXT OPPORTUNITY</p>
            <h1>Create a resume that feels ready for real interviews.</h1>
            <p className="hero-text">
              ResumeYourCollege helps students and early-career professionals craft
              sharper resumes, keep versions organized, and export polished PDFs for
              applications.
            </p>

            <div className="cta-row">
              <Link className="primary-button" to="/register">
                Start building
              </Link>
              <Link className="secondary-button secondary-light" to="/login">
                I already have an account
              </Link>
            </div>

            <div className="hero-meta">
              <span>Student-first</span>
              <span>ATS-friendly structure</span>
              <span>Export-ready</span>
            </div>
          </div>

          <div className="resume-preview-card" aria-label="Resume preview example">
            <div className="resume-preview-top">
              <span className="mini-tag">Resume preview</span>
              <span className="mini-badge">Professional</span>
            </div>

            <div className="resume-preview-body">
              <div className="preview-header">
                <div>
                  <h2>Avyaan Verma</h2>
                  <p>Frontend Developer • Student</p>
                </div>
                <div className="preview-badges">
                  <span>React</span>
                  <span>JavaScript</span>
                </div>
              </div>

              <div className="preview-grid">
                <div>
                  <h3>Education</h3>
                  <p>B.Tech in Computer Science</p>
                </div>
                <div>
                  <h3>Experience</h3>
                  <p>Frontend Engineer Intern</p>
                </div>
                <div>
                  <h3>Projects</h3>
                  <p>Resume Builder • Dashboard Design</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="content-section">
          <div className="section-heading">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>From blank page to application-ready resume.</h2>
          </div>

          <div className="step-grid">
            {workflow.map((step, index) => (
              <article key={step.title} className="info-card">
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="content-section alt-section">
          <div className="section-heading">
            <p className="eyebrow">YOUR CAREER STACK</p>
            <h2>Everything students need to present themselves clearly.</h2>
          </div>

          <div className="feature-layout">
            <div className="feature-list">
              {features.map((feature) => (
                <div key={feature} className="feature-item">
                  <span className="checkmark">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <aside className="feature-panel">
              <p className="panel-label">Built for placement prep</p>
              <h3>Organized, proof-based, and easy to update.</h3>
              <p>
                Keep multiple resume versions for internship, campus hiring, and
                project-based roles without starting from scratch every time.
              </p>
            </aside>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">TEMPLATES</p>
            <h2>Professional structure without excess noise.</h2>
          </div>

          <div className="template-grid">
            {templateHighlights.map((item) => (
              <div key={item.label} className="template-card">
                <span>{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="content-section faq-section">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Questions students usually ask before they start.</h2>
          </div>

          <div className="faq-list">
            {faq.map((item) => (
              <article key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>
          <Link className="brand footer-brand" to="/">
            ResumeYour<span>College </span>
          </Link>
          <Link className="username" to="https://github.com/avyaanverma">
            @avyaan<span>verma</span>
          </Link>
        </div>
        <div className="footer-links">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
}
