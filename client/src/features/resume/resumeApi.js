import api from "../../shared/api/http";

const basePath = "/private/resumes";

export const createResume = async (payload = {}) =>
  (await api.post(basePath, payload)).data.data;
export const getResumes = async () => (await api.get(basePath)).data.data;
export const getResume = async (id) =>
  (await api.get(`${basePath}/${id}`)).data.data;
export const updateResumeSection = async (id, section, data) =>
  (await api.patch(`${basePath}/${id}`, { section, data })).data.data;
export const downloadResumePdf = async (id) =>
  api.get(`${basePath}/${id}/export/pdf`, { responseType: "blob" });
export const createResumePreview = async (id) =>
  (await api.post(`${basePath}/${id}/preview`)).data.data;
export const downloadResumePreview = async (id, previewId) =>
  api.get(`${basePath}/${id}/preview/${previewId}/pdf`, {
    responseType: "blob",
  });
export const deleteResumePreview = async (id, previewId) =>
  api.delete(`${basePath}/${id}/preview/${previewId}`);
export const generateResumeFromPrompt = async (prompt) =>
  (await api.post("/private/prompt", { prompt })).data.data;
export const deleteResume = async (id) => {
  const response = await api.delete(`/private/resumes/${id}`);
  return response.data.data;
};
