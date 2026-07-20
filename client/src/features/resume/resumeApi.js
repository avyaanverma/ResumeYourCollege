import api from "../../shared/api/http";

const basePath = "/private/resumes";

export const createResume = async (payload = {}) => (await api.post(basePath, payload)).data.data;
export const getResumes = async () => (await api.get(basePath)).data.data;
export const getResume = async (id) => (await api.get(`${basePath}/${id}`)).data.data;
export const updateResumeSection = async (id, section, data) =>
  (await api.patch(`${basePath}/${id}`, { section, data })).data.data;
export const downloadResumePdf = async (id) =>
  api.get(`${basePath}/${id}/export/pdf`, { responseType: "blob" });
