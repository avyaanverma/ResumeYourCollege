import { Link } from "react-router";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-card">
        <Link className="brand" to="/">
          ResumeYour<span>College</span>
        </Link>
        <h1>Terms of Service</h1>
        <p>
          ResumeYourCollege provides a platform for creating and exporting student
          resumes. By using the service, you agree to use the application for lawful
          purposes and to provide truthful information in your resume content.
        </p>
        <p>
          We do not claim ownership over the content you create in your account. You
          remain responsible for the accuracy and appropriateness of the resume
          material you input and export.
        </p>
        <p>
          The service may be updated, paused, or changed at any time to improve
          reliability, security, and user experience. Continued use after changes
          constitutes acceptance of the updated terms.
        </p>
        <Link className="primary-button" to="/">
          Back home
        </Link>
      </div>
    </main>
  );
}
