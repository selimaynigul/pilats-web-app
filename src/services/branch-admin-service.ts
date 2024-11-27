import { apiClient } from "config";

const branchAdminService = {
  register: (params = {}) => apiClient.post("/branchAdmin", params),

  search: (params = {}) => apiClient.post("/branchAdmin/search", params),

  update: (params = {}) => apiClient.put("/branchAdmin", params),

  delete: (id: any) => apiClient.delete(`/branchAdmin/${id}`),

  getById: (id: any) => apiClient.get(`/branchAdmin/${id}`),
};

export default branchAdminService;
