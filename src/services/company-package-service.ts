import { apiClient } from "config";

const companyPackageService = {
  add: (params = {}) => apiClient.post("/company-package", params),

  update: (params = {}) => apiClient.put("/company-package", params),

  delete: (id: number) => apiClient.delete(`/company-package/${id}`),

  search: (params = {}) =>
    apiClient.post("/company-package/getAllWithDynamicFilter", params),

  getById: (id: number) => apiClient.get(`/company-package/${id}`),
};

export default companyPackageService;
