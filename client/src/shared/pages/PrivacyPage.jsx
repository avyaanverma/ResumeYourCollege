import { Link } from "react-router";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-card">
        <Link className="brand" to="/">
          ResumeYour<span>College</span>
        </Link>
        <h1>Privacy Policy</h1>
        <p>
          ResumeYourCollege stores the information required to create and manage your
          resume profile, including account information and resume content, in order
          to provide the service.
        </p>
        <p>
          Access to your resume data is restricted to your authenticated account. We
          use secure session handling and protected storage practices to reduce the
          risk of unauthorized access.
        </p>
        <p>
          You may update or delete your personal resume data through the app. If
          security or compliance requirements change, the service may require
          additional verification before sensitive account actions are processed.
        </p>
        <Link className="primary-button" to="/">
          Back home
        </Link>
      </div>
    </main>
  );
}
