import { apiClient } from "config";

const sessionService = {
  add: (params = {}) => apiClient.post("/session", params),

  update: (params = {}) => apiClient.put("/session", params),

  delete: (id: number) => apiClient.delete(`/session/${id}`),

  search: (params = {}) => apiClient.post("/session/search", params),

  getById: (id: number) => apiClient.get(`/session/${id}`),

  getCustomerSessions: (params = {}) =>
    apiClient.post("/session/searchWithCustomerLastEvent", params),
};

export default sessionService;
