import { NavLink } from "react-router";
import { RESUME_STEPS } from "../../constants/steps";
import "./ResumeSidebar.css";

export default function ResumeSidebar() {
  return (
    <aside className="resume-sidebar">
      {RESUME_STEPS.map((step, index) => (
        <NavLink
          key={step.id}
          to={step.id}
          className={({ isActive }) =>
            isActive ? "step active" : "step"
          }
        >
          {step.title}
        </NavLink>
      ))}
    </aside>
  );
}   
