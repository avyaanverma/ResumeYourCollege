import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
export function getApiError(error) {
  const data = error.response?.data;

  const validationErrors = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.errors)
      ? data.errors
      : Array.isArray(data?.message)
        ? data.message
        : null;

  if (validationErrors) {
    return validationErrors;
  }

  // Normal API errors
  return [
    {
      field: "general",
      message: data?.message || "Something went wrong",
    },
  ];
}

export default http;
