import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
export function getApiError(error) {
  const data = error.response?.data;

  // Validation errors
  if (Array.isArray(data?.message)) {
    return data.message;
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
