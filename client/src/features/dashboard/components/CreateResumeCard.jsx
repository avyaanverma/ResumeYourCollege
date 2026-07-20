import "./styles/CreateResumeCard.css";

export default function CreateResumeCard({ onCreateResume, loading }) {
    return (
        <section className="resume-card">

            <div>
                <p className="resume-card-tag">
                    Resume Workspace
                </p>

                <h2>
                    Let's create your first resume.
                </h2>

                <p>
                    We'll guide you through every section—from your profile and
                    education to projects, skills, and achievements.
                </p>
            </div>

            <button
                className="create-button"
                onClick={onCreateResume}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Resume →"}
            </button>

        </section>
    );
}