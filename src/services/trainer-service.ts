import { apiClient } from "config";

const trainerService = {
  search: (params = {}) => apiClient.post("/trainer/search", params),

  get: (params = {}) => apiClient.get("/auth/register", { params }),
};

export default trainerService;
