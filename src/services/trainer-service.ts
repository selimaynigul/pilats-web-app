import { apiClient } from "config";

const trainerService = {
  getAll: (params = {}) => apiClient.post("/trainer/search", params),

  getTrainer: (params = {}) => apiClient.get("/auth/register", { params }),
};

export default trainerService;
