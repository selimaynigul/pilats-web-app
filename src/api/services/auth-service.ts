import apiClient from "../config";

const authService = {
  login: (params: { email: string; password: string }) =>
    apiClient.post("/auth/login", params),

  register: (params = {}) => apiClient.post("/auth/register", params),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
