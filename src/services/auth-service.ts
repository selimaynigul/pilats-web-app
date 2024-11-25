import { apiClient } from "config";

const authService = {
  login: (params: { email: string; password: string }) => {
    console.log(params);
    return apiClient.get("/auth/login", { params });
  },

  adminRegister: (params = {}) =>
    apiClient.post("/auth/register/admin", params),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

export default authService;
