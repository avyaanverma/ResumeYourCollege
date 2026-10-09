import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { resetPassword } from "../authApi";
import { getApiError } from "../../../shared/api/http";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = searchParams.get("token") || "";

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.data.message);
    } catch (requestError) {
      setError(getApiError(requestError)[0]?.message || "Could not reset the password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">ACCOUNT RECOVERY</p>
      <h2>Choose a new password</h2>
      <p className="form-subtitle">Use at least 8 characters with upper and lowercase letters, a number, and a symbol.</p>
      {token ? (
        <form className="auth-form" onSubmit={submit}>
          <label>
            New password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              minLength="8"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {message && <p className="form-success" role="status">{message}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={submitting || Boolean(message)}>
            {submitting ? "Updating..." : "Reset password"}
          </button>
        </form>
      ) : (
        <p className="form-error" role="alert">This reset link is missing its token. Request a new link.</p>
      )}
      <p className="switch-auth"><Link to="/login">Back to sign in</Link></p>
    </section>
  );
}
