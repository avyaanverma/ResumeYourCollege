import "./styles/HeroSection.css";

export default function HeroSection({ firstName }) {
  return (
    <section className="hero">
      <p className="hero-tag">Resume Builder</p>

      <h1>
        Welcome back,
        <span> {firstName}</span>
      </h1>

      <p>
        Build a professional ATS-friendly resume section by section. Your
        progress is automatically saved so you can continue anytime.
      </p>
    </section>
  );
}
