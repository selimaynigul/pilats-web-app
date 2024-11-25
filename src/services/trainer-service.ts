import { apiClient } from "config";

const trainerService = {
  getAll: () => apiClient.get("/get"),

  getTrainer: (params = {}) => apiClient.get("/auth/register", { params }),
};

export default trainerService;
