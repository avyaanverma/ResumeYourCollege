import { Form, Link, useNavigation } from "react-router";

export default function AuthForm({ mode, error }) {
  const isRegister = mode === "register";
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const title = isRegister ? "Create your account" : "Welcome back";

  return (
    <div className="auth-card">
      <p className="eyebrow">
        {isRegister ? "START FOR FREE" : "SIGN IN TO CONTINUE"}
      </p>
      <h2>{title}</h2>
      <p className="form-subtitle">
        {isRegister
          ? "Start building a resume you are proud to share."
          : "Pick up right where you left off."}
      </p>
      <Form method="post" className="auth-form">
        {isRegister && (
          <div className="name-fields">
            <label>
              First name
              <input
                name="firstName"
                autoComplete="given-name"
                required
                minLength="2"
              />
            </label>
            <label>
              Last name
              <input
                name="lastName"
                autoComplete="family-name"
                required
                minLength="2"
              />
            </label>
          </div>
        )}
        <label>
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={
              isRegister
                ? "8+ characters, uppercase, number & symbol"
                : "Enter your password"
            }
            required
            minLength="8"
          />
        </label>
        {isRegister && (
          <p className="hint">
            Use 8+ characters with uppercase, lowercase, number, and a symbol.
          </p>
        )}
        {Array.isArray(error) &&
          error.map((err, index) => (
            <p key={index} className="form-error">
              {err.message}
            </p>
          ))}
        <button className="primary-button" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait…"
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
      </Form>
      <p className="switch-auth">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
