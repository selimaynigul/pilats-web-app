import { apiClient } from "config";

const companyPackageService = {
  add: (params = {}) => apiClient.post("/companyPackage", params),

  update: (params = {}) => apiClient.put("/companyPackage", params),

  delete: (id: number) => apiClient.delete(`/companyPackage/${id}`),

  search: (params = {}) => apiClient.post("/companyPackage/search", params),

  getById: (id: number) => apiClient.get(`/companyPackage/${id}`),
};

export default companyPackageService;
