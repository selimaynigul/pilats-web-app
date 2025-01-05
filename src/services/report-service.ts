import { apiClient } from "config";

const reportService = {
  getReports: () => apiClient.get("/reports"),
};

export default reportService;