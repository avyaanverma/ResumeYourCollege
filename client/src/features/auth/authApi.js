import http from "../../shared/api/http";

const basePath = "/public/auth";

export const login = async (credentials) =>
  (await http.post(`${basePath}/login`, credentials)).data.data;
export const register = async (details) =>
  (await http.post(`${basePath}/register`, details)).data.data;
export const getCurrentUser = async () =>
  (await http.get(`${basePath}/me`)).data.data;
export const logout = () => http.post(`${basePath}/logout`);
