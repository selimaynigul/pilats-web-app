import { apiClient } from "config";

const branchService = {
  add: (params = {}) => apiClient.post("/branch", params),

  update: (params = {}) => apiClient.put("/branch", params),

  delete: (branchId: any) => apiClient.delete(`/branch/${branchId}`),

  search: (params = {}) => apiClient.post("/branch/search", params),
};

export default branchService;
