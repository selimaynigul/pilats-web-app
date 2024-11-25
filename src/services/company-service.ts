import { apiClient } from "config";

const companyService = {
  getAll: () => apiClient.get("/"),

  getCompany: (params = {}) => apiClient.get("/", { params }),
};

export default companyService;
