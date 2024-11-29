import { apiClient } from "config";

const authService = {
  login: (params: { email: string; password: string }) =>
    apiClient.post("/auth/login", params),

  adminRegister: (params = {}) =>
    apiClient.post("/auth/register/admin", params),
};

export default authService;
