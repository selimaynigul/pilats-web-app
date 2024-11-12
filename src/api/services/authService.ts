// src/api/services/authService.ts

import apiClient from "../config";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData: object) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
