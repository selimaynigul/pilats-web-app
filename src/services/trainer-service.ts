import { apiClient } from "config";

const trainerService = {
  search: (params = {}) => apiClient.post("/trainer/search", params),

  getById: (id: any) => apiClient.get(`/trainer/${id}`),

  register: (params = {}) => apiClient.post("/trainer", params),

  update: (data: any) => apiClient.put("/trainer", data),

  delete: (id: any) => apiClient.delete(`/trainer/${id}`),
};

export default trainerService;
