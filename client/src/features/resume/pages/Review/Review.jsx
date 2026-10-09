import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getApiError } from "../../../../shared/api/http";
import { setCurrentResume } from "../../resumeSlice";
import {
  createResumePreview,
  deleteResumePreview,
  downloadResumePreview,
  updateResumeSection,
} from "../../resumeApi";
import ResumePreviewEditor, { getSectionValidation } from "./ResumePreviewEditor";
import "./Review.css";

const editableSections = [
  "personal",
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "languages",
];

function cloneResume(resume) {
  return Object.fromEntries(editableSections.map((section) => [
    section,
    structuredClone(
      resume?.[section] ??
      (section === "personal" ? {} : section === "summary" ? "" : [])
    ),
  ]));
}

export default function Review() {
  const resume = useSelector((state) => state.resume.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const [draft, setDraft] = useState(() => resume ? cloneResume(resume) : null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [generating, setGenerating] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [errors, setErrors] = useState({});
  const [expired, setExpired] = useState(false);
  const previewIdRef = useRef(null);
  const objectUrlRef = useRef(null);
  const generationLock = useRef(false);
  const initialGenerationFor = useRef(null);
  const mountedRef = useRef(false);
  const expiryRedirectRef = useRef(null);

  const dirtySections = useMemo(() => {
    if (!resume || !draft) return [];
    return editableSections.filter(
      (section) =>
        JSON.stringify(draft[section]) !==
        JSON.stringify(resume[section] ?? (section === "personal" ? {} : section === "summary" ? "" : []))
    );
  }, [draft, resume]);

  useEffect(() => {
    if (resume?._id === resumeId) setDraft(cloneResume(resume));
  }, [resume?._id, resumeId]);

  const generatePreview = useCallback(async () => {
    if (!resumeId || generationLock.current) return;
    generationLock.current = true;
    setGenerating(true);
    setErrors({});
    setPreviewError("");
    let nextPreviewId;
    try {
      const next = await createResumePreview(resumeId);
      nextPreviewId = next.previewId;
      if (!mountedRef.current) {
        await deleteResumePreview(resumeId, nextPreviewId);
        return;
      }
      const response = await downloadResumePreview(resumeId, next.previewId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const nextUrl = URL.createObjectURL(blob);
      if (!mountedRef.current) {
        URL.revokeObjectURL(nextUrl);
        await deleteResumePreview(resumeId, nextPreviewId);
        return;
      }
      const oldPreviewId = previewIdRef.current;
      const oldObjectUrl = objectUrlRef.current;

      previewIdRef.current = next.previewId;
      objectUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
      setExpiresAt(new Date(next.expiresAt));
      setExpired(false);
      if (oldObjectUrl) URL.revokeObjectURL(oldObjectUrl);
      if (oldPreviewId) {
        deleteResumePreview(resumeId, oldPreviewId).catch((error) => {
          console.warn("Unable to immediately remove the previous preview", error);
        });
      }
    } catch (error) {
      if (nextPreviewId) {
        deleteResumePreview(resumeId, nextPreviewId).catch((cleanupError) => {
          console.warn("Unable to immediately remove the failed preview", cleanupError);
        });
      }
      if (mountedRef.current) {
        const message = getApiError(error)[0]?.message || "Could not generate the resume preview";
        setPreviewError(message);
        toast.error(message);
      }
    } finally {
      generationLock.current = false;
      setGenerating(false);
    }
  }, [resumeId]);

  useEffect(() => {
    if (!resume || resume._id !== resumeId || initialGenerationFor.current === resumeId) return;
    initialGenerationFor.current = resumeId;
    setDraft(cloneResume(resume));
    generatePreview();
  }, [generatePreview, resume, resumeId]);

  useEffect(() => {
    if (!expiresAt) return undefined;
    const delay = Math.max(0, expiresAt.getTime() - Date.now());
    const timer = setTimeout(() => {
      setExpired(true);
      setPreviewUrl("");
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
      toast.error("This preview expired. Returning to your dashboard.");
      expiryRedirectRef.current = setTimeout(() => navigate("/dashboard"), 3500);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (expiryRedirectRef.current) clearTimeout(expiryRedirectRef.current);
    };
  }, [expiresAt, navigate]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (expiryRedirectRef.current) clearTimeout(expiryRedirectRef.current);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (previewIdRef.current) {
        deleteResumePreview(resumeId, previewIdRef.current).catch((error) => {
          console.warn("Preview cleanup will be retried by the server expiry process", error);
        });
      }
    };
  }, [resumeId]);

  async function regenerate() {
    if (!draft || generating) return;
    const validationErrors = {};
    for (const section of dirtySections) {
      const validation = getSectionValidation(section, draft[section]);
      if (!validation.valid) validationErrors[section] = validation.message;
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    try {
      let savedResume = resume;
      for (const section of dirtySections) {
        savedResume = await updateResumeSection(resumeId, section, draft[section]);
      }
      if (dirtySections.length) {
        dispatch(setCurrentResume(savedResume));
        setDraft(cloneResume(savedResume));
      }
      await generatePreview();
    } catch (error) {
      if (mountedRef.current) {
        toast.error(getApiError(error)[0]?.message || "Please correct the highlighted fields");
      }
    }
  }

  function download() {
    if (!previewUrl || expired) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    const name = resume?.personal?.fullName || resume?.title || "resume";
    link.download = `${name.replace(/[^a-z0-9 _-]/gi, "").trim().replace(/\s+/g, "-")}-resume.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Your resume is downloading");
  }

  if (!resume || !draft) return <section className="form-page"><p>Loading resume...</p></section>;

  return (
    <section className="resume-preview-page">
      <header className="resume-preview-toolbar">
        <div>
          <p className="eyebrow">FINAL REVIEW</p>
          <h1>Preview your resume</h1>
          <p>Review the full document, make edits, and regenerate before downloading.</p>
        </div>
        <div className="preview-actions">
          <button type="button" className="secondary-button" onClick={() => setZoom((value) => Math.max(50, value - 10))} disabled={zoom <= 50}>−</button>
          <span className="preview-zoom">{zoom}%</span>
          <button type="button" className="secondary-button" onClick={() => setZoom((value) => Math.min(150, value + 10))} disabled={zoom >= 150}>+</button>
          <button type="button" className="secondary-button" onClick={() => setZoom(100)}>Fit</button>
          <button type="button" className="primary-button" onClick={download} disabled={!previewUrl || expired || generating || dirtySections.length > 0}>Download PDF</button>
        </div>
      </header>

      {expiresAt && (
        <p className="preview-expiry">
          Temporary preview expires at {expiresAt.toLocaleTimeString()}.
          {expired && " This preview has expired."}
        </p>
      )}

      <div className="resume-preview-workspace">
        <section className="resume-preview-viewer" aria-label="Resume PDF preview">
          {previewUrl && !expired ? (
            <iframe
              key={`${previewUrl}-${zoom}`}
              title="Generated resume preview"
              src={`${previewUrl}#toolbar=0&navpanes=0&zoom=${zoom}`}
            />
          ) : (
            <div className="preview-empty">
              {generating ? (
                <>
                  <span className="spinner" />
                  <p>Generating full resume preview...</p>
                </>
              ) : (
                <>
                  <p>{previewError || "Preview is unavailable."}</p>
                  <button type="button" className="primary-button" onClick={generatePreview}>
                    Retry preview
                  </button>
                </>
              )}
            </div>
          )}
        </section>
        <ResumePreviewEditor
          resume={resume}
          draft={draft}
          setDraft={setDraft}
          dirtySections={dirtySections}
          errors={errors}
        />
      </div>

      <footer className="preview-footer">
        <button type="button" className="secondary-button" onClick={() => navigate("..")}>Back to sections</button>
        <button type="button" className="primary-button" disabled={generating || expired} onClick={regenerate}>
          {generating ? "Generating preview..." : "Save changes and regenerate"}
        </button>
        <button type="button" className="primary-button" disabled={!previewUrl || expired || generating || dirtySections.length > 0} onClick={download}>Looks good — download</button>
      </footer>
    </section>
  );
}
