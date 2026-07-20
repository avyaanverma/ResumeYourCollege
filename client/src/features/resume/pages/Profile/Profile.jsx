import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { updateResumeSection } from "../../resumeApi";
import { setCurrentResume } from "../../resumeSlice";
export default function Profile() {
  const current = useSelector((s) => s.resume.current);
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  useEffect(() => {
    if (current) reset({ ...current.personal, summary: current.summary });
  }, [current, reset]);
  async function submit(v) {
    try {
      let resume = await updateResumeSection(resumeId, "personal", {
        fullName: v.fullName,
        email: v.email,
        phone: v.phone || "",
        location: v.location || "",
        linkedin: v.linkedin || "",
        github: v.github || "",
        portfolio: v.portfolio || "",
      });
      resume = await updateResumeSection(resumeId, "summary", v.summary || "");
      dispatch(setCurrentResume(resume));
      toast.success("Profile saved");
      navigate("../education");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Could not save profile");
    }
  }
  return (
    <section className="form-page">
      <h1>Profile</h1>
      <p>This information appears at the top of your resume.</p>
      <form onSubmit={handleSubmit(submit)} className="form-grid">
        <label className="field">
          Full name
          <input {...register("fullName", { required: true })} />
        </label>
        <label className="field">
          Email
          <input type="email" {...register("email", { required: true })} />
        </label>
        <label className="field">
          Phone
          <input {...register("phone")} />
        </label>
        <label className="field">
          Location
          <input {...register("location")} />
        </label>
        <label className="field">
          LinkedIn
          <input {...register("linkedin")} />
        </label>
        <label className="field">
          GitHub
          <input {...register("github")} />
        </label>
        <label className="field">
          Portfolio
          <input {...register("portfolio")} />
        </label>
        <label className="field full">
          Professional summary
          <textarea {...register("summary")} />
        </label>
        {(errors.fullName || errors.email) && (
          <p className="form-error">
            Full name and a valid email are required.
          </p>
        )}
        <button className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </section>
  );
}
