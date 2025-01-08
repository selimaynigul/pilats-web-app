import { apiClient } from "config";

const reportService = {
  getReports: (params = {}) => apiClient.post("/changeAudit/search", params),
};

export default reportService;