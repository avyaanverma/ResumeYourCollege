import { Outlet } from "react-router";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { getResume } from "../resumeApi";
import { setCurrentResume } from "../resumeSlice";

import ResumeHeader from "../components/ResumeHeader/ResumeHeader";
import ResumeSidebar from "../components/ResumeSidebar/ResumeSidebar";

import "./ResumeLayout.css";

export default function ResumeLayout() {
  const { resumeId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    getResume(resumeId).then((resume) => dispatch(setCurrentResume(resume)));
  }, [resumeId, dispatch]);
  return (
    <div className="resume-layout">
      <ResumeHeader />

      <div className="resume-body">
        <ResumeSidebar />

        <main className="resume-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
