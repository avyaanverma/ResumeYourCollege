import { useState } from "react";
import { Link } from "react-router";
import { requestPasswordReset } from "../authApi";
import { getApiError } from "../../../shared/api/http";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.data.message);
    } catch (requestError) {
      setError(getApiError(requestError)[0]?.message || "Could not request a reset link");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">ACCOUNT RECOVERY</p>
      <h2>Forgot your password?</h2>
      <p className="form-subtitle">Enter your account email and we’ll send a reset link.</p>
      <form className="auth-form" onSubmit={submit}>
        <label>
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        {message && <p className="form-success" role="status">{message}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button" disabled={submitting}>
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="switch-auth"><Link to="/login">Back to sign in</Link></p>
    </section>
  );
}
