import { apiClient } from "config";

const companyAdminService = {
  register: (params = {}) => apiClient.post("/companyAdmin", params),

  search: (params = {}) => apiClient.post("/companyAdmin/search", params),

  update: (params = {}) => apiClient.put("/companyAdmin", params),

  delete: (id: any) => apiClient.delete(`/companyAdmin/${id}`),

  getById: (id: any) => apiClient.get(`/companyAdmin/${id}`),
};

export default companyAdminService;
