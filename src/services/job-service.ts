import { apiClient } from "config";

const jobService = {
  add: (params = {}) => apiClient.post("/job", params),
  getAll: (params = {}) => apiClient.post("/job/getByPagination", params),
};

export default jobService;