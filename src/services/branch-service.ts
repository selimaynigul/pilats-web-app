import { apiClient } from "config";

const branchService = {
  add: (params = {}) => apiClient.post("/branch", params),

  update: (params = {}) => apiClient.put("/branch", params),

  delete: (branchId: any) => apiClient.delete(`/branch/${branchId}`),

  getByPagination: (params = {}) =>
    apiClient.post("/branch/getByPagination", params),
};

export default branchService;
