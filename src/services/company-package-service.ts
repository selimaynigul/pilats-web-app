import { apiClient } from "config";

const companyPackageService = {
  add: (params = {}) => apiClient.post("/companyPackage", params),

  update: (params = {}) => apiClient.put("/company-package", params),

  delete: (id: number) => apiClient.delete(`/company-package/${id}`),

  search: (params = {}) => apiClient.post("/companyPackage/search", params),

  getById: (id: number) => apiClient.get(`/company-package/${id}`),
};

export default companyPackageService;
